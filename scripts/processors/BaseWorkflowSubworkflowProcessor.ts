// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import { builders, createWorkflowConfigs, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { loadYAMLFilesAsMap, resolveFromRoot } from "../utils";
import { EntityProcessor, EntityProcessorOptions } from "./EntityProcessor";

export abstract class BaseWorkflowSubworkflowProcessor extends EntityProcessor {
    protected applications: string[] = ["espresso"];

    protected workflowSubforkflowMapByApplication: {
        workflows: Record<string, any>;
        subworkflows: Record<string, any>;
    } = { workflows: {}, subworkflows: {} };

    constructor(options: EntityProcessorOptions) {
        super(options);
    }

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
            this.workflowSubforkflowMapByApplication.subworkflows[name] = loadYAMLFilesAsMap(swDir);
        });

        this.assets = [];
        return this.assets;
    }

    protected enablePredefinedIds(): void {
        const WorkflowCls = Workflow as any;
        WorkflowCls.usePredefinedIds = true;

        const SubworkflowCls = Subworkflow as any;
        SubworkflowCls.usePredefinedIds = true;

        this.enablePredefinedIdsForBuilders();
        this.enablePredefinedIdsForUnits();
    }

    private enablePredefinedIdsForBuilders(): void {
        (builders as any).UnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssignmentUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssertionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).ExecutionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).IOUnitConfigBuilder.usePredefinedIds = true;
    }

    private enablePredefinedIdsForUnits(): void {
        (UnitFactory as any).BaseUnit.usePredefinedIds = true;
        (UnitFactory as any).AssignmentUnit.usePredefinedIds = true;
        (UnitFactory as any).AssertionUnit.usePredefinedIds = true;
        (UnitFactory as any).ExecutionUnit.usePredefinedIds = true;
        (UnitFactory as any).IOUnit.usePredefinedIds = true;
        (UnitFactory as any).SubworkflowUnit.usePredefinedIds = true;
        (UnitFactory as any).ConditionUnit.usePredefinedIds = true;
        (UnitFactory as any).MapUnit.usePredefinedIds = true;
        (UnitFactory as any).ProcessingUnit.usePredefinedIds = true;
    }

    protected getOutputDirs() {
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
        return { outputWorkflowsDir, outputSubworkflowsDir };
    }

    protected buildWorkflowConfigs(): any[] {
        const WorkflowCls = Workflow as any;
        this.enablePredefinedIds();
        return createWorkflowConfigs({
            applications: this.applications,
            WorkflowCls,
            workflowSubforkflowMapByApplication: this.workflowSubforkflowMapByApplication,
            SubworkflowCls: Subworkflow,
            UnitFactoryCls: UnitFactory,
            unitBuilders: { ...builders, Workflow: WorkflowCls },
        } as any) as any[];
    }

    protected writeItems(
        items: { appName: string; name: string; config: any }[],
        baseDir: string,
    ): void {
        items.forEach((item) => {
            const appDir = path.resolve(baseDir, item.appName);
            serverUtils.file.createDirIfNotExistsSync(appDir);
            const filename = `${item.name}.json`;
            const filePath = path.resolve(appDir, filename);
            serverUtils.json.writeJSONFileSync(filePath, item.config, {
                spaces: BUILD_CONFIG.jsonFormat.spaces,
            });
        });
    }
}
