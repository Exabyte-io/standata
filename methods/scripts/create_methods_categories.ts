/**
 * Generates categories.yml by scanning generated JSON method files.
 *
 * This script extracts categories and tags from method JSON files and
 * creates a comprehensive categories.yml file with:
 * - All unique category values organized by tier1, tier2, tier3, type, subtype
 * - All unique tags
 * - Entity mappings showing which categories apply to each file
 *
 * Configuration at the top allows customization of:
 * - Source paths (dataPath, categoriesPath)
 * - Which category keys to extract (categoryKeys)
 * - Whether to extract from units arrays (extractFromUnits)
 * - Whether to extract tags (extractTags)
 */

import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

interface CategoryConfig {
    categoriesPath: string;
    dataPath: string;
    categoryKeys: string[];
    extractFromUnits: boolean;
    extractTags: boolean;
}

interface CategoryData {
    tier1: Set<string>;
    tier2: Set<string>;
    tier3: Set<string>;
    type: Set<string>;
    subtype: Set<string>;
    tags: Set<string>;
}

interface EntityData {
    filename: string;
    categories: string[];
}

const CONFIG: CategoryConfig = {
    categoriesPath: "methods/data/categories.yml",
    dataPath: "methods/data",
    categoryKeys: ["tier1", "tier2", "tier3", "type", "subtype"],
    extractFromUnits: true,
    extractTags: true,
};

class MethodsCategoriesBuilder {
    private config: CategoryConfig;
    private categoryData: CategoryData;
    private entities: EntityData[];

    constructor(config: CategoryConfig) {
        this.config = config;
        this.categoryData = {
            tier1: new Set(),
            tier2: new Set(),
            tier3: new Set(),
            type: new Set(),
            subtype: new Set(),
            tags: new Set(),
        };
        this.entities = [];
    }

    private extractCategoriesFromObject(obj: any): void {
        if (!obj.categories) return;

        this.config.categoryKeys.forEach((key) => {
            const value = obj.categories[key];
            if (value && typeof value === "string") {
                (this.categoryData as any)[key].add(value);
            }
        });
    }

    private extractTagsFromObject(obj: any): void {
        if (!this.config.extractTags || !obj.tags) return;

        if (Array.isArray(obj.tags)) {
            obj.tags.forEach((tag: string) => {
                if (typeof tag === "string") {
                    this.categoryData.tags.add(tag);
                }
            });
        }
    }

    private collectCategoriesFromEntity(entity: any): string[] {
        const categories = new Set<string>();

        const processObject = (obj: any) => {
            if (obj.categories) {
                this.config.categoryKeys.forEach((key) => {
                    const value = obj.categories[key];
                    if (value && typeof value === "string") {
                        categories.add(value);
                    }
                });
            }

            if (this.config.extractTags && obj.tags && Array.isArray(obj.tags)) {
                obj.tags.forEach((tag: string) => {
                    if (typeof tag === "string") {
                        categories.add(tag);
                    }
                });
            }
        };

        processObject(entity);

        if (this.config.extractFromUnits && entity.units && Array.isArray(entity.units)) {
            entity.units.forEach((unit: any) => processObject(unit));
        }

        return Array.from(categories).sort();
    }

    private processJsonFile(filePath: string): void {
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(content);

            this.extractCategoriesFromObject(data);
            this.extractTagsFromObject(data);

            if (this.config.extractFromUnits && data.units && Array.isArray(data.units)) {
                data.units.forEach((unit: any) => {
                    this.extractCategoriesFromObject(unit);
                    this.extractTagsFromObject(unit);
                });
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

    private buildCategoriesYaml(): any {
        const categories: any = {};

        ["tier1", "tier2", "tier3", "type", "subtype", "tags"].forEach((key) => {
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

        return { categories, entities };
    }

    private writeCategoriesFile(yamlData: any): void {
        const yamlContent = yaml.dump(yamlData, {
            indent: 2,
            lineWidth: -1,
            sortKeys: false,
        });

        fs.writeFileSync(this.config.categoriesPath, yamlContent, "utf-8");
        console.log(`\nCategories file written to: ${this.config.categoriesPath}`);
        console.log(`  - ${Object.keys(yamlData.categories).length} category types`);
        console.log(`  - ${yamlData.entities.length} entities`);
    }

    public build(): void {
        console.log("Building methods categories...\n");

        this.scanJsonFiles();

        const yamlData = this.buildCategoriesYaml();

        this.writeCategoriesFile(yamlData);

        console.log("\nDone!");
    }
}

const builder = new MethodsCategoriesBuilder(CONFIG);
builder.build();

