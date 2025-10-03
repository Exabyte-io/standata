/**
 * Script to generate categories.yml for applications
 *
 * Automatically extracts categories from application JSONs
 */

import { JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

interface EntityData {
    filename: string;
    categories: string[];
}

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

const CONFIG = {
    categoriesPath: "applications/data/categories.yml",
    dataPath: "applications/data",
};

class ApplicationCategoriesBuilder {
    private entities: EntityData[];

    private manualCategoryKeys: Set<string>;

    constructor() {
        this.entities = [];
        this.manualCategoryKeys = new Set();
    }

    private scanJsonFiles(existingEntities: Map<string, string[]>): void {
        const walk = (dir: string) => {
            const files = fs.readdirSync(dir);
            files.forEach((file) => {
                const fullPath = path.join(dir, file);
                if (fs.statSync(fullPath).isDirectory()) {
                    walk(fullPath);
                } else if (file.endsWith(".json")) {
                    const relativePath = path.relative(CONFIG.dataPath, fullPath);
                    // Preserve existing categories if they exist
                    const existingCategories = existingEntities.get(relativePath) || [];
                    this.entities.push({
                        filename: relativePath,
                        categories: existingCategories,
                    });
                }
            });
        };

        walk(CONFIG.dataPath);
        console.log(`Processed ${this.entities.length} JSON files`);
    }

    private readExistingCategories(): any {
        try {
            if (fs.existsSync(CONFIG.categoriesPath)) {
                const content = fs.readFileSync(CONFIG.categoriesPath, "utf-8");
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

        // Merge all manual categories
        Object.entries(existing.categories).forEach(([key, value]) => {
            if (this.manualCategoryKeys.has(key)) {
                generated.categories[key] = value;
                console.log(`  ✓ Preserved manual category: ${key} (marked with !manually_added)`);
            } else {
                console.warn(
                    `  ⚠ Found category "${key}" without !manually_added tag - it will be overwritten`,
                );
            }
        });

        return generated;
    }

    private writeCategoriesFile(yamlData: any): void {
        const manualList =
            this.manualCategoryKeys.size > 0
                ? Array.from(this.manualCategoryKeys).join(", ")
                : "none (add with !manually_added tag)";

        const header = [
            "# WARNING: This file is managed manually",
            "#",
            "# All categories are manually added and preserved",
            `# Manual categories: ${manualList}`,
            "#",
            "# To regenerate the entities list, run:",
            "#   npm run build:applications:categories",
            "#",
            "# All categories should be marked with !manually_added tag:",
            "#   model: !manually_added",
            "#     - quantum-mechanical",
            "#     - atomistic",
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

        fs.writeFileSync(CONFIG.categoriesPath, header + yamlContent, "utf-8");
        console.log(`\nCategories file written to: ${CONFIG.categoriesPath}`);
        console.log(`  - ${Object.keys(yamlData.categories).length} category types`);
        console.log(`  - ${yamlData.entities.length} entities`);
    }

    public build(): void {
        console.log("\nBuilding application categories...\n");

        const existingYaml = this.readExistingCategories();

        // Create a map of existing entity categories
        const existingEntities = new Map<string, string[]>();
        if (existingYaml && existingYaml.entities) {
            existingYaml.entities.forEach((entity: EntityData) => {
                existingEntities.set(entity.filename, entity.categories);
            });
        }

        this.scanJsonFiles(existingEntities);

        const generatedYaml = {
            categories: {},
            entities: this.entities.sort((a, b) => a.filename.localeCompare(b.filename)),
        };

        const finalYaml = this.mergeManualCategories(generatedYaml, existingYaml);

        this.writeCategoriesFile(finalYaml);

        console.log("\nDone!");
    }
}

// Run the builder
const builder = new ApplicationCategoriesBuilder();
builder.build();
