import { Utils } from "@mat3ra/utils";
import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";
// @ts-ignore
import { createWorkflow } from "@mat3ra/wode/dist/workflows/create";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class WorkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
    public static defaultCategoryKeys = ["properties", "isMultimaterial", "tags", "application"];

    private subworkflowMapByApplication: Record<any, string>;

    constructor(rootDir: string, subworkflowsMapByApplication: Record<any, string>) {
        super({
            rootDir,
            entityNamePlural: "workflows",
            assetsDir: BUILD_CONFIG.workflows.assets.path,
            dataDir: BUILD_CONFIG.workflows.data.path,
            buildDir: BUILD_CONFIG.workflows.build.path,
            excludedAssetFiles: [BUILD_CONFIG.workflows.assets.categories],
            categoriesRelativePath: BUILD_CONFIG.workflows.assets.categories,
            categoryKeys: WorkflowsProcessor.defaultCategoryKeys,
        });
        this.subworkflowMapByApplication = subworkflowsMapByApplication;
    }

    private get workflowSubforkflowMapByApplication(): { workflows: any; subworkflows: any } {
        const workflowSubforkflowMapByApplication = { workflows: {}, subworkflows: {} } as any;
        workflowSubforkflowMapByApplication.workflows = this.entityMapByApplication;
        workflowSubforkflowMapByApplication.subworkflows = this.subworkflowMapByApplication;
        return workflowSubforkflowMapByApplication;
    }

    protected buildEntityConfigs(): any[] {
        const WorkflowCls = Workflow as any;
        this.enablePredefinedIds();
        const configs: { appName: string; safeName: string; config: any; tags?: any[] }[] = [];
        this.applications.forEach((appName) => {
            const workflows = this.workflowSubforkflowMapByApplication.workflows[appName];
            if (!workflows) return;
            Object.keys(workflows).forEach((workflowKey) => {
                const workflowData = workflows[workflowKey];
                const workflow = createWorkflow({
                    appName,
                    workflowData,
                    workflowSubworkflowMapByApplication: this.workflowSubforkflowMapByApplication,
                    workflowCls: WorkflowCls,
                    SubworkflowCls: Subworkflow,
                    UnitFactoryCls: UnitFactory,
                    unitBuilders: { ...builders, Workflow: WorkflowCls },
                });
                const workflowName = workflow.prop("name");
                const pathInSource = workflowData?.__path__;
                // Use source path only if it contains nested structure, otherwise use workflow name
                const safeName = pathInSource?.includes("/")
                    ? pathInSource
                    : Utils.str.createSafeFilename(workflowName);
                const tags = workflowData?.tags || [];
                configs.push({
                    appName,
                    safeName,
                    config: (workflow as any).toJSON(),
                    tags,
                });
            });
        });
        return configs;
    }

    protected writeWorkflowSubforkflowMapByApplication(): void {
        serverUtils.json.writeJSONFileSync(
            path.resolve(
                this.resolvedPaths.buildDir,
                BUILD_CONFIG.workflows.build.workflowSubforkflowMapByApplication,
            ),
            this.workflowSubforkflowMapByApplication,
        );
    }

    public writeBuildDirectoryContent(): void {
        this.writeWorkflowSubforkflowMapByApplication();
        super.writeDataDirectoryContent();
    }
}
