import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, createWorkflowConfigs, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class WorkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
    private subworkflowMapByApplication: Record<any, string>;

    constructor(rootDir: string, subworkflowsMapByApplication: Record<any, string>) {
        super({
            rootDir,
            entityNamePlural: "workflows",
            assetsDir: BUILD_CONFIG.workflows.assets.path,
            categoriesRelativePath: BUILD_CONFIG.workflows.assets.categories,
            dataDir: BUILD_CONFIG.workflows.data.path,
            buildDir: BUILD_CONFIG.workflows.build.path,
            excludedAssetFiles: [BUILD_CONFIG.workflows.assets.categories],
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
        const configs = createWorkflowConfigs({
            applications: this.applications,
            WorkflowCls,
            workflowSubforkflowMapByApplication: this.workflowSubforkflowMapByApplication,
            SubworkflowCls: Subworkflow,
            UnitFactoryCls: UnitFactory,
            unitBuilders: { ...builders, Workflow: WorkflowCls },
        } as any) as any[];
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
    }
}
