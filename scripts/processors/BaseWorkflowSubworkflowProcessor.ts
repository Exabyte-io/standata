// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { loadYAMLFilesAsMap } from "../utils";
import { AssetRecord, EntityProcessor, EntityProcessorOptions } from "./EntityProcessor";

export abstract class BaseWorkflowSubworkflowProcessor extends EntityProcessor {
    // TODO: get from applications yaml
    protected applications: string[] = ["espresso"];

    public entityMapByApplication: Record<string, any>;

    constructor(options: EntityProcessorOptions) {
        super(options);
        this.entityMapByApplication = {};
    }

    public setEntityMapByApplication() {
        this.applications.forEach((name) => {
            const pathForName = `${this.resolvedPaths.assetsDir}/${name}`;
            this.entityMapByApplication[name] = loadYAMLFilesAsMap(pathForName);
        });
    }

    protected abstract generateEntities(): any[];

    public readAssets(): AssetRecord[] {
        this.setEntityMapByApplication();
        super.readAssets();

        const generatedEntities = this.generateEntities();
        this.assets = [
            {
                sourceFile: this.categoriesPath,
                entities: generatedEntities,
            },
        ];

        return this.assets;
    }

    protected transformEntity(entity: any, _sourceFile: string): any {
        const baseEntity = entity.config && entity.config.name ? entity.config : entity;
        const transformed = { ...baseEntity };
        delete transformed._appName;
        delete transformed.schema;
        return transformed;
    }

    public writeDataDirectoryContent(): void {
        const { dataDir } = this.resolvedPaths;

        this.assets.forEach(({ sourceFile, entities }) => {
            entities.forEach((entity: any) => {
                const subdir = entity._appName || "";
                const transformed = this.transformEntity({ ...entity }, sourceFile);

                const targetDir = path.join(dataDir, subdir);
                const filename = `${transformed.name.toLowerCase().replace(/[-\s]+/g, "_")}.json`;
                const targetPath = path.join(targetDir, filename);

                serverUtils.json.writeJSONFileSync(targetPath, transformed, {
                    spaces: BUILD_CONFIG.jsonFormat.spaces,
                });
                console.log(`  Created: ${targetPath}`);
            });
        });
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

    public writeDistDirectoryContent(): void {
        // Workflows and subworkflows are not distributed as individual files
    }
}
