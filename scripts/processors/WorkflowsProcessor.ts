import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, Subworkflow, UnitFactory, Workflow, createWorkflow } from "@mat3ra/wode";
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

    private get workflowSubworkflowMapByApplication(): { workflows: any; subworkflows: any } {
        const workflowSubworkflowMapByApplication = { workflows: {}, subworkflows: {} } as any;
        workflowSubworkflowMapByApplication.workflows = this.entityMapByApplication;
        workflowSubworkflowMapByApplication.subworkflows = this.subworkflowMapByApplication;
        return workflowSubworkflowMapByApplication;
    }

    protected buildEntityConfigs(): any[] {
        const WorkflowCls = Workflow as any;
        this.enablePredefinedIds();
        const configs: { appName: string; safeName: string; config: any; tags?: any[] }[] = [];
        // For each application (from application_data.yml), look into its folder under assets/workflows/workflows/{appName}
        // and load all YAML files, preserving their relative paths to use as safeName in build/data output structure
        this.applications.forEach((appName) => {
            const workflows = this.workflowSubworkflowMapByApplication.workflows[appName];
            if (!workflows) return;
            Object.keys(workflows).forEach((workflowKey) => {
                const workflowData = workflows[workflowKey];
                const workflow = createWorkflow({
                    appName,
                    workflowData,
                    workflowSubworkflowMapByApplication: this.workflowSubworkflowMapByApplication,
                    workflowCls: WorkflowCls,
                    SubworkflowCls: Subworkflow,
                    UnitFactoryCls: UnitFactory,
                    unitBuilders: { ...builders, Workflow: WorkflowCls },
                });
                const config = this.buildConfigFromEntityData(
                    workflowData,
                    workflowKey,
                    appName,
                    workflow,
                );
                configs.push(config);
            });
        });
        return configs;
    }

    protected writeworkflowSubworkflowMapByApplication(): void {
        serverUtils.json.writeJSONFileSync(
            path.resolve(
                this.resolvedPaths.buildDir,
                BUILD_CONFIG.workflows.build.workflowSubworkflowMapByApplication,
            ),
            this.workflowSubworkflowMapByApplication,
        );
    }

    public writeBuildDirectoryContent(): void {
        this.writeworkflowSubworkflowMapByApplication();
        super.writeDataDirectoryContent();
    }
}
