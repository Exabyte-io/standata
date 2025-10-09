// eslint-disable-next-line import/no-extraneous-dependencies
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    builders,
    createSubworkflowByName,
    createWorkflowConfigs,
    Subworkflow,
    UnitFactory,
    Workflow, // @ts-ignore
} from "@mat3ra/wode";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { loadYAMLFilesAsMap, resolveFromRoot } from "../utils";
import { EntityProcessor } from "./EntityProcessor";

export class WorkflowsProcessor extends EntityProcessor {
    constructor(rootDir: string) {
        super({
            rootDir,
            entityNamePlural: "workflows",
            assetsDir: BUILD_CONFIG.workflows.assets.path,
            categoriesRelativePath: BUILD_CONFIG.workflows.assets.workflowsCategories,
            dataDir: BUILD_CONFIG.workflows.data.path,
            buildDir: BUILD_CONFIG.workflows.build.path,
            excludedAssetFiles: [
                BUILD_CONFIG.workflows.assets.workflowsCategories,
                BUILD_CONFIG.workflows.assets.subworkflowsCategories,
            ],
        });
    }

    private applications: string[] = ["espresso"];

    private workflowSubforkflowMapByApplication: {
        workflows: Record<string, any>;
        subworkflows: Record<string, any>;
    } = { workflows: {}, subworkflows: {} };

    public readAssets() {
        const sourcesRoot = resolveFromRoot(
            this.options.rootDir,
            BUILD_CONFIG.workflows.assets.path,
        );

        this.applications.forEach((name) => {
            this.workflowSubforkflowMapByApplication.workflows[name] = {};
            this.workflowSubforkflowMapByApplication.subworkflows[name] = {};

            const wfDir = path.resolve(sourcesRoot, BUILD_CONFIG.workflows.assets.workflows, name);
            const swDir = path.resolve(
                sourcesRoot,
                BUILD_CONFIG.workflows.assets.subworkflows,
                name,
            );

            this.workflowSubforkflowMapByApplication.workflows[name] = loadYAMLFilesAsMap(wfDir);
            const wfCount = Object.keys(
                this.workflowSubforkflowMapByApplication.workflows[name],
            ).length;
            console.log(`Building ${name}: ${wfCount} workflow(s)`);

            this.workflowSubforkflowMapByApplication.subworkflows[name] = loadYAMLFilesAsMap(swDir);
            const swCount = Object.keys(
                this.workflowSubforkflowMapByApplication.subworkflows[name],
            ).length;
            console.log(`Building ${name}: ${swCount} subworkflow(s)`);
        });

        this.assets = [];
        return this.assets;
    }

    public writeBuildDirectoryContent(): void {
        if (!this.resolvedPaths.buildDir) return;
        const buildDir = this.resolvedPaths.buildDir as string;
        serverUtils.file.createDirIfNotExistsSync(buildDir);

        serverUtils.json.writeJSONFileSync(
            path.resolve(
                buildDir,
                BUILD_CONFIG.workflows.build.workflowSubforkflowMapByApplication,
            ),
            this.workflowSubforkflowMapByApplication,
        );
    }

    public writeDataDirectoryContent(): void {
        const WorkflowCls = Workflow as any;
        WorkflowCls.usePredefinedIds = true;

        const SubworkflowCls = Subworkflow as any;
        SubworkflowCls.usePredefinedIds = true;

        (builders as any).UnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssignmentUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssertionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).ExecutionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).IOUnitConfigBuilder.usePredefinedIds = true;

        (UnitFactory as any).BaseUnit.usePredefinedIds = true;
        (UnitFactory as any).AssignmentUnit.usePredefinedIds = true;
        (UnitFactory as any).AssertionUnit.usePredefinedIds = true;
        (UnitFactory as any).ExecutionUnit.usePredefinedIds = true;
        (UnitFactory as any).IOUnit.usePredefinedIds = true;
        (UnitFactory as any).SubworkflowUnit.usePredefinedIds = true;
        (UnitFactory as any).ConditionUnit.usePredefinedIds = true;
        (UnitFactory as any).MapUnit.usePredefinedIds = true;
        (UnitFactory as any).ProcessingUnit.usePredefinedIds = true;

        const workflowConfigs = createWorkflowConfigs({
            applications: this.applications,
            WorkflowCls,
            workflowSubforkflowMapByApplication: this.workflowSubforkflowMapByApplication,
            SubworkflowCls,
            UnitFactoryCls: UnitFactory,
            unitBuilders: {
                ...builders,
                Workflow: WorkflowCls,
            },
        } as any) as any[];

        const workflowItems = workflowConfigs.map((config: any) => ({
            appName: config.application,
            name: Utils.str.createSafeFilename(config.name),
            config: config.config,
        }));

        const outputWorkflowsDir = path.resolve(
            this.resolvedPaths.dataDir,
            BUILD_CONFIG.workflows.data.workflows,
        );
        const outputSubworkflowsDir = path.resolve(
            this.resolvedPaths.dataDir,
            BUILD_CONFIG.workflows.data.subworkflows,
        );

        serverUtils.file.createDirIfNotExistsSync(outputWorkflowsDir);
        serverUtils.file.createDirIfNotExistsSync(outputSubworkflowsDir);

        const generateConfigFiles = (
            items: { appName: string; name: string; config: any }[],
            type: "workflow" | "subworkflow",
        ) => {
            const baseDir = type === "workflow" ? outputWorkflowsDir : outputSubworkflowsDir;
            items.forEach((item) => {
                const appDir = path.resolve(baseDir, item.appName);
                serverUtils.file.createDirIfNotExistsSync(appDir);
                const filename = `${item.name}.json`;
                const filePath = path.resolve(appDir, filename);
                serverUtils.json.writeJSONFileSync(filePath, item.config, {
                    spaces: BUILD_CONFIG.jsonFormat.spaces,
                });
                console.log(`Generated ${type}: ${item.appName}/${filename}`);
            });
        };

        generateConfigFiles(workflowItems, "workflow");

        const subworkflowItems: { appName: string; name: string; config: any }[] = [];
        this.applications.forEach((appName) => {
            const subworkflows = this.workflowSubforkflowMapByApplication.subworkflows[appName];
            if (!subworkflows) return;

            Object.keys(subworkflows).forEach((subworkflowName) => {
                const subworkflow = createSubworkflowByName({
                    appName,
                    swfName: subworkflowName,
                    workflowsData: this.workflowSubforkflowMapByApplication,
                });
                subworkflowItems.push({
                    appName,
                    name: subworkflowName,
                    config: (subworkflow as any).toJSON(),
                });
            });
        });
        generateConfigFiles(subworkflowItems, "subworkflow");
    }
}
