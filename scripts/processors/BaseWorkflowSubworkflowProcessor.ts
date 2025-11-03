// eslint-disable-next-line import/no-extraneous-dependencies
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";
import path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { loadYAMLFilesAsMap, readYAMLFileResolved } from "../utils";
import { CategorizedEntityProcessor } from "./CategorizedEntityProcessor";
import { AssetRecord, EntityProcessorOptions } from "./EntityProcessor";

export abstract class BaseWorkflowSubworkflowProcessor extends CategorizedEntityProcessor {
    protected applications: string[] = [];

    public entityMapByApplication: Record<string, any>;

    public entityConfigs: object[];

    constructor(options: EntityProcessorOptions) {
        super(options);
        this.entityMapByApplication = {};
        this.entityConfigs = [];
        this.applications = this.getApplicationSListFromYAML();
    }

    protected getApplicationSListFromYAML(): string[] {
        const appsPath = `${BUILD_CONFIG.applications.assets.path}/applications/application_data.yml`;
        const resolvedAppsPath = path.resolve(__dirname, "../../", appsPath);
        const appsYAML: any = readYAMLFileResolved(resolvedAppsPath);
        return Object.keys(appsYAML);
    }

    public getCategoryCollectOptions() {
        return {
            includeUnits: true,
            includeTags: true,
            includeEntitiesMap: true,
        };
    }

    public addCategoriesFromObject(
        obj: any,
        categoryKeys: string[],
        includeTags: boolean,
        categorySets: Record<string, Set<string>>,
    ): void {
        categoryKeys.forEach((key) => {
            let value = (obj as any)[key];
            if (key === "application" && value && typeof value === "object" && value.name) {
                value = value.name;
            }
            if (Array.isArray(value)) {
                value.forEach((v: string) => {
                    if (typeof v === "string" && v) (categorySets as any)[key].add(v);
                });
            } else if (typeof value === "string" && value) {
                (categorySets as any)[key].add(value);
            }
        });
        if (includeTags && Array.isArray(obj?.tags)) {
            obj.tags.forEach((t: string) => (categorySets as any).tags.add(t));
        }
    }

    public addCategoriesToSet(
        obj: any,
        categoryKeys: string[],
        includeTags: boolean,
        target: Set<string>,
    ): void {
        categoryKeys.forEach((key) => {
            let value = (obj as any)[key];
            if (key === "application" && value && typeof value === "object" && value.name) {
                value = value.name;
            }
            if (Array.isArray(value)) {
                value.forEach((v: string) => {
                    if (typeof v === "string" && v) target.add(v);
                });
            } else if (typeof value === "string" && value) {
                target.add(value);
            }
        });
        if (includeTags && Array.isArray(obj?.tags)) {
            obj.tags.forEach((t: string) => target.add(t));
        }
    }

    public setEntityMapByApplication() {
        this.applications.forEach((name) => {
            const pathForName = `${this.resolvedPaths.assetsDir}/${name}`;
            this.entityMapByApplication[name] = loadYAMLFilesAsMap(pathForName);
        });
    }

    protected getSafeNameFromPath(pathInSource: string | undefined, fallbackName: string): string {
        return pathInSource || Utils.str.createSafeFilename(fallbackName);
    }

    protected buildConfigFromEntityData(
        entityData: any,
        entityKey: string,
        appName: string,
        entity: any,
    ): { appName: string; safeName: string; config: any; tags?: any[] } {
        const entityName = entity.prop ? entity.prop("name") : entityKey;
        const pathInSource = entityData?.__path__;
        const safeName = this.getSafeNameFromPath(pathInSource, entityName);
        const tags = entityData?.tags;
        const hasTags = tags && Array.isArray(tags) && tags.length > 0;
        return {
            appName,
            safeName,
            config: entity.toJSON(),
            ...(hasTags ? { tags } : {}),
        };
    }

    protected abstract buildEntityConfigs(): object[];

    public readAssets(): AssetRecord[] {
        this.setEntityMapByApplication();
        // read assets to be able to run buildEntityConfigs
        super.readAssets();
        this.entityConfigs = this.buildEntityConfigs();
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

    private writeEntityConfigs(dirPath: string, minified = true): void {
        this.entityConfigs.forEach((entityConfig: any) => {
            const entityName = (entityConfig as any).safeName;
            const targetPath = `${dirPath}/${entityConfig.appName}/${entityName}.json`;
            const dataToWrite = {
                ...entityConfig.config,
                ...(entityConfig.tags ? { tags: entityConfig.tags } : {}),
                ...(entityConfig.appName ? { application: { name: entityConfig.appName } } : {}),
            };
            const spaces = minified
                ? BUILD_CONFIG.buildJSONFormat.spaces
                : BUILD_CONFIG.dataJSONFormat.spaces;
            serverUtils.json.writeJSONFileSync(targetPath, dataToWrite, { spaces });
        });
    }

    public writeBuildDirectoryContent(): void {
        this.writeEntityConfigs(this.resolvedPaths.buildDir, true);
    }

    public writeDataDirectoryContent() {
        super.writeDataDirectoryContent();
        this.writeEntityConfigs(this.resolvedPaths.dataDir, false);
    }
}
