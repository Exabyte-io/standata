// @ts-ignore
import { builders, createSubworkflowByName, Subworkflow, UnitFactory } from "@mat3ra/wode";
import path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { loadYAMLFilesAsMap } from "../utils";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class SubworkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
    public static defaultCategoryKeys = ["properties", "isMultimaterial", "tags", "application"];

    constructor(rootDir: string) {
        super({
            rootDir,
            entityNamePlural: "subworkflows",
            assetsDir: BUILD_CONFIG.subworkflows.assets.path,
            dataDir: BUILD_CONFIG.subworkflows.data.path,
            buildDir: BUILD_CONFIG.subworkflows.build.path,
            excludedAssetFiles: [BUILD_CONFIG.subworkflows.assets.categories],
            categoriesRelativePath: BUILD_CONFIG.subworkflows.assets.categories,
            categoryKeys: SubworkflowsProcessor.defaultCategoryKeys,
        });
    }

    private getSharedSubworkflowsForApplication(
        sharedSubworkflows: Record<string, any>,
        applicationName: string,
    ): Record<string, any> {
        return Object.fromEntries(
            Object.entries(sharedSubworkflows)
                .filter(
                    ([, data]: [string, any]) =>
                        !Array.isArray(data.apps) || data.apps.includes(applicationName),
                )
                .map(([name, { apps: _, ...data }]: [string, any]) => [
                    name,
                    { ...data, application: { name: applicationName } },
                ]),
        );
    }

    public setEntityMapByApplication() {
        const sharedPath = path.resolve(
            __dirname,
            "../../",
            BUILD_CONFIG.subworkflows.assets.sharedPath,
        );
        const sharedSubworkflows = loadYAMLFilesAsMap(sharedPath);
        this.applications.forEach((applicationName) => {
            const applicationSubworkflows = loadYAMLFilesAsMap(
                `${this.resolvedPaths.assetsDir}/${applicationName}`,
            );
            this.entityMapByApplication[applicationName] = {
                ...this.getSharedSubworkflowsForApplication(sharedSubworkflows, applicationName),
                ...applicationSubworkflows,
            };
        });
    }

    private get workflowSubworkflowMapByApplication(): { workflows: any; subworkflows: any } {
        const workflowSubworkflowMapByApplication = { workflows: {}, subworkflows: {} } as any;
        workflowSubworkflowMapByApplication.workflows = {};
        workflowSubworkflowMapByApplication.subworkflows = this.entityMapByApplication;
        return workflowSubworkflowMapByApplication;
    }

    protected buildEntityConfigs(): any[] {
        this.enablePredefinedIds();
        const configs: { appName: string; safeName: string; config: any }[] = [];
        this.applications.forEach((appName) => {
            const subworkflows = this.workflowSubworkflowMapByApplication.subworkflows[appName];
            if (!subworkflows) return;
            Object.keys(subworkflows).forEach((subworkflowName) => {
                const subworkflowData = subworkflows[subworkflowName];
                // @ts-ignore
                const subworkflow = createSubworkflowByName({
                    appName,
                    swfName: subworkflowName,
                    workflowSubworkflowMapByApplication: this.workflowSubworkflowMapByApplication,
                    SubworkflowCls: Subworkflow,
                    UnitFactoryCls: UnitFactory,
                    unitBuilders: builders,
                });
                const config = this.buildConfigFromEntityData(
                    subworkflowData,
                    subworkflowName,
                    appName,
                    subworkflow,
                );
                configs.push(config);
            });
        });
        return configs;
    }
}
