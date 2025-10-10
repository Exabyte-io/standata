// @ts-ignore
import { createSubworkflowByName } from "@mat3ra/wode";

import { BUILD_CONFIG } from "../../build-config";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class SubworkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
    constructor(rootDir: string) {
        super({
            rootDir,
            entityNamePlural: "subworkflows",
            assetsDir: BUILD_CONFIG.workflows.assets.path,
            categoriesRelativePath: BUILD_CONFIG.workflows.assets.subworkflowsCategories,
            dataDir: BUILD_CONFIG.workflows.data.path,
            buildDir: BUILD_CONFIG.workflows.build.path,
            excludedAssetFiles: [
                BUILD_CONFIG.workflows.assets.workflowsCategories,
                BUILD_CONFIG.workflows.assets.subworkflowsCategories,
            ],
        });
    }

    public writeBuildDirectoryContent(): void {
        // Do nothing: this processor should not create the map
    }

    public writeDataDirectoryContent(): void {
        this.generateAndWriteSubworkflowsData();
    }

    protected generateAndWriteSubworkflowsData(): void {
        const items: { appName: string; name: string; config: any }[] = [];
        this.applications.forEach((appName) => {
            const subworkflows = this.workflowSubforkflowMapByApplication.subworkflows[appName];
            if (!subworkflows) return;
            Object.keys(subworkflows).forEach((subworkflowName) => {
                const subworkflow = createSubworkflowByName({
                    appName,
                    swfName: subworkflowName,
                    workflowsData: this.workflowSubforkflowMapByApplication,
                });
                items.push({
                    appName,
                    name: subworkflowName,
                    config: (subworkflow as any).toJSON(),
                });
            });
        });
        const { outputSubworkflowsDir } = this.getOutputDirs();
        this.writeItems(items, outputSubworkflowsDir);
    }
}
