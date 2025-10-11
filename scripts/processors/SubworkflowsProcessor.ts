// @ts-ignore
import { createSubworkflowByName } from "@mat3ra/wode";

import { BUILD_CONFIG } from "../../build-config";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class SubworkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
    public static defaultCategoryKeys = ["properties", "isMultimaterial", "tags"];

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

    public getCategoryCollectOptions() {
        return {
            includeUnits: false,
            includeTags: true,
            includeEntitiesMap: true,
        };
    }

    private get workflowSubforkflowMapByApplication(): { workflows: any; subworkflows: any } {
        const workflowSubforkflowMapByApplication = { workflows: {}, subworkflows: {} } as any;
        workflowSubforkflowMapByApplication.workflows = {};
        workflowSubforkflowMapByApplication.subworkflows = this.entityMapByApplication;
        return workflowSubforkflowMapByApplication;
    }

    protected buildEntityConfigs(): any[] {
        const configs: { appName: string; safeName: string; config: any }[] = [];
        this.applications.forEach((appName) => {
            const subworkflows = this.workflowSubforkflowMapByApplication.subworkflows[appName];
            if (!subworkflows) return;
            Object.keys(subworkflows).forEach((subworkflowName) => {
                const subworkflow = createSubworkflowByName({
                    appName,
                    swfName: subworkflowName,
                    workflowsData: this.workflowSubforkflowMapByApplication,
                });
                const tags = subworkflows[subworkflowName]?.tags;
                configs.push({
                    appName,
                    safeName: subworkflowName,
                    config: (subworkflow as any).toJSON(),
                    ...(tags ? { tags } : {}),
                });
                console.log({ configs });
            });
        });
        return configs;
    }
}
