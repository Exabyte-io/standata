/**
 * Generates categories.yml by scanning generated workflow/subworkflow JSON files.
 *
 * This script extracts categories from workflow JSON files and creates
 * a comprehensive categories.yml file with:
 * - All unique category values (application, property, material_count)
 * - Entity mappings showing which categories apply to each file
 *
 * Configuration is imported from workflows/workflows-build-config.ts
 * Types are imported from src/js/types/categoryConfig.ts
 */

import { JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

import type { CategoryConfig, CategoryData, EntityData } from "../../src/js/types/categoryConfig";
import { SUBWORKFLOW_CONFIG, WORKFLOW_CONFIG } from "./workflows-build-config";

// Custom YAML type to mark manual categories
class ManualType {
    public value: any;

    constructor(value: any) {
        this.value = value;
    }
}

const ManualYamlType = new yaml.Type("!manually_added", {
    kind: "sequence",
    construct: (data: any) => new ManualType(data),
    instanceOf: ManualType,
    represent: (data: any) => (data as ManualType).value,
});

const MANUAL_SCHEMA = JsYamlAllSchemas.extend([ManualYamlType]);

class WorkflowCategoriesBuilder {
    private config: CategoryConfig;

    private categoryData: CategoryData;

    private entities: EntityData[];

    private manualCategoryKeys: Set<string>;

    constructor(config: CategoryConfig) {
        this.config = config;
        this.categoryData = {
            application: new Set(),
            property: new Set(),
            material_count: new Set([this.config.defaultMaterialCount]),
        };
        this.entities = [];
        this.manualCategoryKeys = new Set();
    }

    private extractApplicationFromObject(obj: any): void {
        if (obj[this.config.applicationKey]?.name) {
            this.categoryData.application.add(obj[this.config.applicationKey].name);
        }
    }

    private extractPropertiesFromObject(obj: any): void {
        const properties = obj[this.config.propertiesKey];
        if (properties && Array.isArray(properties)) {
            properties.forEach((prop: string) => {
                if (typeof prop === "string") {
                    this.categoryData.property.add(prop);
                }
            });
        }
    }

    private collectCategoriesFromEntity(entity: any): string[] {
        const categories = new Set<string>();

        const processObject = (obj: any) => {
            if (obj[this.config.applicationKey]?.name) {
                categories.add(obj[this.config.applicationKey].name);
            }

            const properties = obj[this.config.propertiesKey];
            if (properties && Array.isArray(properties)) {
                properties.forEach((prop: string) => {
                    if (typeof prop === "string") {
                        categories.add(prop);
                    }
                });
            }
        };

        processObject(entity);

        if (this.config.extractFromSubworkflows && entity.subworkflows) {
            if (Array.isArray(entity.subworkflows)) {
                entity.subworkflows.forEach((subworkflow: any) => processObject(subworkflow));
            }
        }

        categories.add(this.config.defaultMaterialCount);

        return Array.from(categories).sort();
    }

    private processJsonFile(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(content);

            this.extractApplicationFromObject(data);
            this.extractPropertiesFromObject(data);

            if (this.config.extractFromSubworkflows && data.subworkflows) {
                if (Array.isArray(data.subworkflows)) {
                    data.subworkflows.forEach((subworkflow: any) => {
                        this.extractApplicationFromObject(subworkflow);
                        this.extractPropertiesFromObject(subworkflow);
                    });
                }
            }

            const relativePath = path.relative(this.config.dataPath, filePath);
            const categories = this.collectCategoriesFromEntity(data);

            if (categories.length > 0) {
                this.entities.push({
                    filename: relativePath,
                    categories,
                });
            }
        } catch (error: any) {
            console.error(`Error processing ${filePath}: ${error.message}`);
        }
    }

    private findJsonFilesRecursively(dir: string): string[] {
        const files: string[] = [];
        const items = fs.readdirSync(dir);

        items.forEach((item) => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                files.push(...this.findJsonFilesRecursively(fullPath));
            } else if (stat.isFile() && item.endsWith(".json")) {
                files.push(fullPath);
            }
        });

        return files;
    }

    private scanJsonFiles(): void {
        const absoluteDataPath = path.resolve(this.config.dataPath);
        const jsonFiles = this.findJsonFilesRecursively(absoluteDataPath);

        jsonFiles.forEach((filePath) => {
            this.processJsonFile(filePath);
        });

        console.log(`Processed ${jsonFiles.length} JSON files`);
    }

    private readExistingCategories(): any {
        try {
            if (fs.existsSync(this.config.categoriesPath)) {
                const content = fs.readFileSync(this.config.categoriesPath, "utf-8");
                const data = yaml.load(content, { schema: MANUAL_SCHEMA }) as any;

                // Detect manual categories from YAML tags
                if (data && data.categories) {
                    Object.entries(data.categories).forEach(([key, value]) => {
                        if (value instanceof ManualType) {
                            this.manualCategoryKeys.add(key);
                            // Replace ManualType with actual value
                            data.categories[key] = value.value;
                        }
                    });
                }

                return data;
            }
        } catch (error: any) {
            console.warn(`Could not read existing categories: ${error.message}`);
        }
        return null;
    }

    private mergeManualCategories(generated: any, existing: any): any {
        if (!existing || !existing.categories) {
            return generated;
        }

        const merged = { ...generated };

        Object.keys(existing.categories).forEach((key) => {
            if (!this.config.autoExtractedCategories.includes(key)) {
                if (this.manualCategoryKeys.has(key)) {
                    merged.categories[key] = existing.categories[key];
                    console.log(
                        `  ✓ Preserved manual category: ${key} (marked with !manually_added)`,
                    );
                } else {
                    merged.categories[key] = existing.categories[key];
                    console.warn(
                        `  ⚠ Warning: Preserving category '${key}' not marked with !manually_added tag. Consider adding !manually_added tag.`,
                    );
                }
            }
        });

        if (existing.entities && Array.isArray(existing.entities)) {
            existing.entities.forEach((existingEntity: any) => {
                const generatedEntity = merged.entities.find(
                    (e: any) => e.filename === existingEntity.filename,
                );

                if (generatedEntity && existingEntity.categories) {
                    const manualCategories = existingEntity.categories.filter(
                        (cat: string) =>
                            !generatedEntity.categories.includes(cat) &&
                            !this.isAutoExtractedCategory(cat),
                    );

                    if (manualCategories.length > 0) {
                        generatedEntity.categories = [
                            ...generatedEntity.categories,
                            ...manualCategories,
                        ].sort();
                        console.log(
                            `  ✓ Preserved manual categories for ${
                                existingEntity.filename
                            }: ${manualCategories.join(", ")}`,
                        );
                    }
                }
            });
        }

        return merged;
    }

    private isAutoExtractedCategory(category: string): boolean {
        return (
            this.categoryData.application.has(category) ||
            this.categoryData.property.has(category) ||
            this.categoryData.material_count.has(category)
        );
    }

    private buildCategoriesYaml(): any {
        const categories: any = {};

        this.config.autoExtractedCategories.forEach((key) => {
            const values = Array.from((this.categoryData as any)[key]).sort();
            if (values.length > 0) {
                categories[key] = values;
            }
        });

        const entities = this.entities
            .sort((a, b) => a.filename.localeCompare(b.filename))
            .map((entity) => ({
                filename: entity.filename,
                categories: entity.categories,
            }));

        const generated = { categories, entities };

        const existing = this.readExistingCategories();
        return this.mergeManualCategories(generated, existing);
    }

    private writeCategoriesFile(yamlData: any): void {
        const autoList = this.config.autoExtractedCategories.join(", ");
        const manualList =
            this.manualCategoryKeys.size > 0
                ? Array.from(this.manualCategoryKeys).join(", ")
                : "none (add with !manually_added tag)";

        const header = [
            "# WARNING: This file is partially auto-generated",
            "#",
            `# Auto-extracted categories (regenerated): ${autoList}`,
            `# Manual categories (preserved): ${manualList}`,
            "#",
            "# To regenerate auto-extracted categories, run:",
            "#   npm run build:workflows:categories",
            "#",
            "# Manual categories and per-entity manual categories will be preserved.",
            "# To add new manual category types, mark them with !manually_added tag in YAML:",
            "#   workflow_type: !manually_added",
            "#     - value1",
            "#     - value2",
            "",
        ].join("\n");

        // Mark manual categories with !manually_added tag when writing
        const dataToWrite = JSON.parse(JSON.stringify(yamlData));
        Object.keys(dataToWrite.categories).forEach((key) => {
            if (this.manualCategoryKeys.has(key)) {
                dataToWrite.categories[key] = new ManualType(dataToWrite.categories[key]);
            }
        });

        const yamlContent = yaml.dump(dataToWrite, {
            indent: 2,
            lineWidth: -1,
            sortKeys: false,
            schema: MANUAL_SCHEMA,
        });

        fs.writeFileSync(this.config.categoriesPath, header + yamlContent, "utf-8");
        console.log(`\nCategories file written to: ${this.config.categoriesPath}`);
        console.log(`  - ${Object.keys(yamlData.categories).length} category types`);
        console.log(`  - ${yamlData.entities.length} entities`);
    }

    public build(): void {
        console.log(`Building ${path.basename(this.config.dataPath)} categories...\n`);

        this.scanJsonFiles();

        const yamlData = this.buildCategoriesYaml();

        this.writeCategoriesFile(yamlData);

        console.log("\nDone!");
    }
}

console.log("=== Building Workflow Categories ===\n");
const workflowBuilder = new WorkflowCategoriesBuilder(WORKFLOW_CONFIG);
workflowBuilder.build();

console.log("\n=== Building Subworkflow Categories ===\n");
const subworkflowBuilder = new WorkflowCategoriesBuilder(SUBWORKFLOW_CONFIG);
subworkflowBuilder.build();
