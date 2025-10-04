/**
 * Build script for model-method compatibility map
 *
 * Converts YAML source to JSON format for runtime consumption
 * Following standata's build pattern but specialized for model-method mapping
 */

import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

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

function parseModelCategories(categoryKey: string): ModelCategories {
    const parts = categoryKey.split(".");
    const categories: ModelCategories = {};

    if (parts[0]) categories.tier1 = parts[0];
    if (parts[1]) categories.tier2 = parts[1];
    if (parts[2]) categories.tier3 = parts[2];
    if (parts[3]) categories.type = parts[3];
    if (parts[4]) categories.subtype = parts[4];

    return categories;
}

export function buildModelMethodMap(): void {
    const sourceFile = "./models/sources/modelMethodMap.yml";
    const targetFile = "./models/data/modelMethodMap.json";

    console.log(`Building model-method map from ${sourceFile}...`);

    // Read and parse YAML
    const yamlContent = fs.readFileSync(sourceFile, "utf8");
    const yamlData = yaml.load(yamlContent) as Record<string, FilterRule[]>;

    // Convert to flat ModelMethodFilterEntry array
    const filterEntries: ModelMethodFilterEntry[] = [];

    for (const [categoryKey, filterRules] of Object.entries(yamlData)) {
        // Skip comments and non-data entries
        if (typeof filterRules !== "object" || !Array.isArray(filterRules)) {
            continue;
        }

        const modelCategories = parseModelCategories(categoryKey);

        filterEntries.push({
            modelCategories,
            filterRules,
        });
    }

    // Write JSON file to data directory
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFile, JSON.stringify(filterEntries, null, 2), "utf8");
    console.log(`Generated: ${targetFile}`);
    console.log(`Model-method map built successfully with ${filterEntries.length} entries`);
}

// Run if called directly
if (require.main === module) {
    buildModelMethodMap();
}
