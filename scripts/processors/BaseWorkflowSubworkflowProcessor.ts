// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-extraneous-dependencies
// @ts-ignore
import serverUtils from "@mat3ra/utils/server";
// @ts-ignore
import { builders, Subworkflow, UnitFactory, Workflow } from "@mat3ra/wode";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

import { BUILD_CONFIG } from "../../build-config";
import { loadYAMLFilesAsMap, StandataYamlSchema } from "../utils";
import { CategoryManager } from "./CategoryManager";
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

    protected getCategoryKeys(): string[] {
        return ["application", "property", "material_count", "workflow_type"];
    }

    protected getManualCategoryKeys(): string[] {
        return ["workflow_type"];
    }

    protected extractCategoriesFromWorkflowConfig(config: any): string[] {
        const categories: string[] = [];

        if (config.subworkflows?.[0]?.application?.name) {
            categories.push(config.subworkflows[0].application.name);
        }

        if (Array.isArray(config.properties)) {
            categories.push(...config.properties);
        }

        const materialCount = this.determineMaterialCount(config);
        if (materialCount) {
            categories.push(materialCount);
        }

        return categories;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected determineMaterialCount(_config: any): string {
        return "single-material";
    }

    public updateCategoriesFile(): void {
        const { categoriesPath } = this;
        const categoryKeys = this.getCategoryKeys();
        const manualKeys = this.getManualCategoryKeys();

        const categoryManager = new CategoryManager();

        categoryKeys.forEach((key) => {
            const isManual = manualKeys.includes(key);
            categoryManager.initializeCategory(key, isManual);
        });

        categoryManager.loadExistingCategories(categoriesPath);

        const entities: { filename: string; categories: string[] }[] = [];
        const jsonFiles = this.findJsonFilesRecursively(this.resolvedPaths.dataDir);

        for (const filePath of jsonFiles) {
            try {
                const data = serverUtils.json.readJSONFileSync(filePath) as any;
                const categoriesForEntity = this.extractCategoriesFromWorkflowConfig(data);

                categoriesForEntity.forEach((value) => {
                    categoryKeys.forEach((key) => {
                        if (!manualKeys.includes(key)) {
                            categoryManager.addValue(key, value);
                        }
                    });
                });

                const relativePath = path.relative(this.resolvedPaths.dataDir, filePath);
                entities.push({
                    filename: relativePath,
                    categories: Array.from(new Set(categoriesForEntity)).sort(),
                });
            } catch (e: any) {
                console.error(`Error processing ${filePath}: ${e.message}`);
            }
        }

        const categoriesOut = categoryManager.toCategoriesObject();
        const payload = {
            categories: categoriesOut,
            entities: entities.sort((a, b) => a.filename.localeCompare(b.filename)),
        };

        const yamlContent = yaml.dump(payload, {
            schema: StandataYamlSchema,
            indent: BUILD_CONFIG.yamlFormat.indent,
            lineWidth: BUILD_CONFIG.yamlFormat.lineWidth,
            sortKeys: BUILD_CONFIG.yamlFormat.sortKeys as boolean,
        });

        serverUtils.file.createDirIfNotExistsSync(path.dirname(categoriesPath));
        fs.writeFileSync(categoriesPath, yamlContent, "utf-8");
        console.log(`Categories file written to: ${categoriesPath}`);
    }
}
