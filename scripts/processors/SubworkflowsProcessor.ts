// @ts-ignore
import { createSubworkflowByName } from "@mat3ra/wode";

import { BUILD_CONFIG } from "../../build-config";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class SubworkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
    constructor(rootDir: string) {
        super({
            rootDir,
            entityNamePlural: "subworkflows",
            assetsDir: BUILD_CONFIG.subworkflows.assets.path,
            categoriesRelativePath: BUILD_CONFIG.subworkflows.assets.categories,
            dataDir: BUILD_CONFIG.subworkflows.data.path,
            buildDir: BUILD_CONFIG.subworkflows.build.path,
            excludedAssetFiles: [BUILD_CONFIG.subworkflows.assets.categories],
        });
    }

    private get workflowSubforkflowMapByApplication(): { workflows: any; subworkflows: any } {
        const workflowSubforkflowMapByApplication = { workflows: {}, subworkflows: {} } as any;
        workflowSubforkflowMapByApplication.workflows = {};
        workflowSubforkflowMapByApplication.subworkflows = this.entityMapByApplication;
        return workflowSubforkflowMapByApplication;
    }

    protected buildEntityConfigs(): any[] {
        const configs: { appName: string; name: string; config: any }[] = [];
        this.applications.forEach((appName) => {
            const subworkflows = this.workflowSubforkflowMapByApplication.subworkflows[appName];
            if (!subworkflows) return;
            Object.keys(subworkflows).forEach((subworkflowName) => {
                const subworkflow = createSubworkflowByName({
                    appName,
                    swfName: subworkflowName,
                    workflowsData: this.workflowSubforkflowMapByApplication,
                });
                configs.push({
                    appName,
                    name: subworkflowName,
                    config: (subworkflow as any).toJSON(),
                });
            });
        });
        return configs;
    }
}
