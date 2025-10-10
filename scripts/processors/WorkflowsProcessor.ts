import { Utils } from "@mat3ra/utils";
import serverUtils from "@mat3ra/utils/server";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class WorkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
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
        this.generateAndWriteWorkflowsData();
    }

    protected generateAndWriteWorkflowsData(): void {
        const configs = this.buildWorkflowConfigs();
        const items = configs.map((config: any) => ({
            appName: config.application,
            name: Utils.str.createSafeFilename(config.name),
            config: config.config,
        }));
        const { outputWorkflowsDir } = this.getOutputDirs();
        this.writeItems(items, outputWorkflowsDir);
    }
}
