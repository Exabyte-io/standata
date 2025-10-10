// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";

import { loadYAMLFilesAsMap } from "../utils";
import { AssetRecord, EntityProcessor, EntityProcessorOptions } from "./EntityProcessor";

export abstract class BaseWorkflowSubworkflowProcessor extends EntityProcessor {
    // TODO: get from applications yaml
    protected applications: string[] = ["espresso"];

    public entityMapByApplication: Record<string, any>;

    public entityConfigs: object[];

    constructor(options: EntityProcessorOptions) {
        super(options);
        this.entityMapByApplication = {};
        this.entityConfigs = [];
    }

    public setEntityMapByApplication() {
        this.applications.forEach((name) => {
            const pathForName = `${this.resolvedPaths.assetsDir}/${name}`;
            this.entityMapByApplication[name] = loadYAMLFilesAsMap(pathForName);
        });
    }

    protected abstract buildEntityConfigs(): object[];

    public readAssets(): AssetRecord[] {
        this.setEntityMapByApplication();
        // read assets to be able to run buildEntityConfigs
        super.readAssets();
        this.buildEntityConfigs();
        return this.assets;
    }

    protected enablePredefinedIds(): void {
        const WorkflowCls = Workflow as any;
        WorkflowCls.usePredefinedIds = true;

        const SubworkflowCls = Subworkflow as any;
        SubworkflowCls.usePredefinedIds = true;

        this.enablePredefinedIdsForBuilders();
        this.enablePredefinedIdsForUnits();
    }

    private enablePredefinedIdsForBuilders(): void {
        (builders as any).UnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssignmentUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssertionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).ExecutionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).IOUnitConfigBuilder.usePredefinedIds = true;
    }

    private enablePredefinedIdsForUnits(): void {
        (UnitFactory as any).BaseUnit.usePredefinedIds = true;
        (UnitFactory as any).AssignmentUnit.usePredefinedIds = true;
        (UnitFactory as any).AssertionUnit.usePredefinedIds = true;
        (UnitFactory as any).ExecutionUnit.usePredefinedIds = true;
        (UnitFactory as any).IOUnit.usePredefinedIds = true;
        (UnitFactory as any).SubworkflowUnit.usePredefinedIds = true;
        (UnitFactory as any).ConditionUnit.usePredefinedIds = true;
        (UnitFactory as any).MapUnit.usePredefinedIds = true;
        (UnitFactory as any).ProcessingUnit.usePredefinedIds = true;
    }

    private writeEntityConfigs(): void {
        this.entityConfigs.forEach((entityConfig) => {
            const entityName = (entityConfig as any).name;
            const targetPath = `${this.resolvedPaths.buildDir}/${entityName}.json`;
            serverUtils.json.writeJSONFileSync(targetPath, entityConfig);
        });
    }

    public writeBuildDirectoryContent(): void {
        this.writeEntityConfigs();
    }
}
