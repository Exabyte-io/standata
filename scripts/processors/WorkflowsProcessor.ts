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
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

import BUILD_CONFIG from "../../build-config";
import { loadYAMLFilesAsMap, resolveFromRoot } from "../utils";
import { EntityProcessor } from "./EntityProcessor";

export class WorkflowsProcessor extends EntityProcessor {
    constructor(rootDir: string) {
        super({
            rootDir,
            entityName: "workflows",
            assetsDir: BUILD_CONFIG.workflows.assets.path,
            dataDir: BUILD_CONFIG.workflows.data.path,
            buildDir: BUILD_CONFIG.workflows.build.path,
            distRuntimeDir: BUILD_CONFIG.runtimeDataDir,
        });
    }

    private applications: string[] = ["espresso"];
    private workflowSubforkflowMapByApplication: { workflows: Record<string, any>; subworkflows: Record<string, any> } =
        { workflows: {}, subworkflows: {} };

    public readAssets() {
        const sourcesRoot = resolveFromRoot(this.options.rootDir, BUILD_CONFIG.workflows.assets.path);

        this.applications.forEach((name) => {
            this.workflowSubforkflowMapByApplication.workflows[name] = {};
            this.workflowSubforkflowMapByApplication.subworkflows[name] = {};

            const wfDir = path.resolve(sourcesRoot, BUILD_CONFIG.workflows.assets.workflows, name);
            const swDir = path.resolve(sourcesRoot, BUILD_CONFIG.workflows.assets.subworkflows, name);

            this.workflowSubforkflowMapByApplication.workflows[name] = loadYAMLFilesAsMap(wfDir);
            const wfCount = Object.keys(this.workflowSubforkflowMapByApplication.workflows[name]).length;
            console.log(`Building ${name}: ${wfCount} workflow(s)`);

            this.workflowSubforkflowMapByApplication.subworkflows[name] = loadYAMLFilesAsMap(swDir);
            const swCount = Object.keys(this.workflowSubforkflowMapByApplication.subworkflows[name]).length;
            console.log(`Building ${name}: ${swCount} subworkflow(s)`);
        });

        this.assets = [];
        return this.assets;
    }

    public writeBuildDirectoryContent(): void {
        if (!this.resolved.buildDir) return;
        const buildDir = this.resolved.buildDir as string;
        serverUtils.file.createDirIfNotExistsSync(buildDir);

        serverUtils.json.writeJSONFileSync(
            path.resolve(buildDir, BUILD_CONFIG.workflows.build.workflowSubforkflowMapByApplication),
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

        const outputWorkflowsDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.workflows);
        const outputSubworkflowsDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.subworkflows);
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

    public updateCategoriesFile(): void {
        const categoriesPathWf = path.resolve(
            resolveFromRoot(this.options.rootDir, BUILD_CONFIG.workflows.assets.path),
            BUILD_CONFIG.workflows.assets.workflowsCategories,
        );
        const categoriesPathSw = path.resolve(
            resolveFromRoot(this.options.rootDir, BUILD_CONFIG.workflows.assets.path),
            BUILD_CONFIG.workflows.assets.subworkflowsCategories,
        );

        const collect = (baseDir: string) => {
            const sets: Record<string, Set<string>> = { names: new Set<string>(), applications: new Set<string>() };
            const findJsonFilesRecursively = (dir: string): string[] => {
                const results: string[] = [];
                const items = fs.readdirSync(dir);
                items.forEach((item) => {
                    const full = path.join(dir, item);
                    const stat = fs.statSync(full);
                    if (stat.isDirectory()) results.push(...findJsonFilesRecursively(full));
                    else if (stat.isFile() && item.endsWith(".json")) results.push(full);
                });
                return results;
            };
            const files = findJsonFilesRecursively(baseDir);
            files.forEach((fp) => {
                const rel = path.relative(baseDir, fp);
                const [appName, fileName] = rel.split(path.sep);
                if (appName) sets.applications.add(appName);
                const nameNoExt = fileName?.replace(/\.json$/i, "");
                if (nameNoExt) sets.names.add(nameNoExt);
            });
            return sets;
        };

        const wfDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.workflows);
        const swDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.subworkflows);

        const wfSets = collect(wfDir);
        const swSets = collect(swDir);

        const dump = (targetPath: string, sets: Record<string, Set<string>>) => {
            const payload = {
                categories: {
                    applications: Array.from(sets.applications).sort(),
                    names: Array.from(sets.names).sort(),
                },
            };
            const yamlContent = yaml.dump(payload, {
                indent: BUILD_CONFIG.yamlFormat.indent,
                lineWidth: BUILD_CONFIG.yamlFormat.lineWidth,
                sortKeys: BUILD_CONFIG.yamlFormat.sortKeys as boolean,
            });
            serverUtils.file.createDirIfNotExistsSync(path.dirname(targetPath));
            fs.writeFileSync(targetPath, yamlContent, "utf-8");
            console.log(`Categories file written to: ${targetPath}`);
        };

        dump(categoriesPathWf, wfSets);
        dump(categoriesPathSw, swSets);
    }
}


