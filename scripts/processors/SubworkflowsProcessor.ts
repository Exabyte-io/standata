// @ts-ignore
import { builders, createSubworkflowByName, Subworkflow, UnitFactory } from "@mat3ra/wode";

import { BUILD_CONFIG } from "../../build-config";
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
