/**
 * Build script for model-method compatibility map
 *
 * Converts YAML source to JSON format for runtime consumption
 * Following standata's build pattern but specialized for model-method mapping
 */

import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

import BUILD_CONFIG from "../../build-config";

interface FilterRule {
    path?: string;
    regex?: string;
}

interface ModelCategories {
    tier1?: string;
    tier2?: string;
    tier3?: string;
    type?: string;
    subtype?: string;
}

interface ModelMethodFilterEntry {
    modelCategories: ModelCategories;
    filterRules: FilterRule[];
}

function parseModelCategories(categoryPath: string[]): ModelCategories {
    const categories: ModelCategories = {};

    if (categoryPath[0]) categories.tier1 = categoryPath[0];
    if (categoryPath[1]) categories.tier2 = categoryPath[1];
    if (categoryPath[2]) categories.tier3 = categoryPath[2];
    if (categoryPath[3]) categories.type = categoryPath[3];
    if (categoryPath[4]) categories.subtype = categoryPath[4];

    return categories;
}

function traverseNestedCategories(
    obj: any,
    currentPath: string[],
    filterEntries: ModelMethodFilterEntry[],
): void {
    for (const [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            const modelCategories = parseModelCategories([...currentPath, key]);
            filterEntries.push({
                modelCategories,
                filterRules: value as FilterRule[],
            });
        } else if (typeof value === "object" && value !== null) {
            traverseNestedCategories(value, [...currentPath, key], filterEntries);
        }
    }
}

export function buildModelMethodMap(): void {
    const sourceFile = `./models/sources/${BUILD_CONFIG.models.sources.modelMethodMap}`;
    const targetFile = `./models/build/${BUILD_CONFIG.models.build.modelMethodMap}`;

    console.log(`Building model-method map from ${sourceFile}...`);

    // Read and parse YAML
    const yamlContent = fs.readFileSync(sourceFile, "utf8");
    const yamlData = yaml.load(yamlContent) as Record<string, any>;

    // Convert nested structure to flat ModelMethodFilterEntry array
    const filterEntries: ModelMethodFilterEntry[] = [];
    traverseNestedCategories(yamlData, [], filterEntries);

    // Write JSON file to data directory
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFile, JSON.stringify(filterEntries), "utf8");
    console.log(`Generated: ${targetFile}`);
    console.log(`Model-method map built successfully with ${filterEntries.length} entries`);
}

// Run if called directly
if (require.main === module) {
    buildModelMethodMap();
}
