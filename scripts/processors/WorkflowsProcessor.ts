import { Utils } from "@mat3ra/utils";
import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, createWorkflowConfigs, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { BaseWorkflowSubworkflowProcessor } from "./BaseWorkflowSubworkflowProcessor";

export class WorkflowsProcessor extends BaseWorkflowSubworkflowProcessor {
    public static defaultCategoryKeys = ["properties", "isMultimaterial", "tags"];

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
        const configs = createWorkflowConfigs({
            applications: this.applications,
            WorkflowCls,
            workflowSubforkflowMapByApplication: this.workflowSubforkflowMapByApplication,
            SubworkflowCls: Subworkflow,
            UnitFactoryCls: UnitFactory,
            unitBuilders: { ...builders, Workflow: WorkflowCls },
        } as any) as any[];
        configs.forEach((c) => {
            c.appName = c.application;
            c.safeName = Utils.str.createSafeFilename(c.name);
            c.tags = this.getTagsForWorkflowByName(c.application, c.name);
        });
        return configs;
    }

    protected getTagsForWorkflowByName(appName: string, name: string): void {
        const asset: any = Object.values(this.entityMapByApplication?.[appName]).find(
            (a: any) => a.name === name,
        );
        return asset?.tags || [];
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
        super.writeDataDirectoryContent();
        this.writeWorkflowSubforkflowMapByApplication();
    }
}
