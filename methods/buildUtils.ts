import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";
import * as lodash from "lodash";
import { getFilesInDirectory, JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";

export interface BuildConfig {
    sourcesPath: string;
    dataPath: string;
    entityType: "models" | "methods";
    pathSeparator?: string;
}


/**
 * Generates URL path based on entity categories and parameters.
 */
export function encodeDataAsURLPath(data: any): string {
    const placeholder = "none";

    const path = ["tier1", "tier2", "tier3", "type", "subtype"]
        .map((key) => lodash.get(data.categories, key, placeholder))
        .join("/");

    const params = new URLSearchParams();
    if (data.parameters) {
        for (const key in data.parameters) {
            if (lodash.isObject(data.parameters[key])) {
                params.append(key, JSON.stringify(data.parameters[key]));
            } else {
                params.append(key, data.parameters[key]);
            }
        }
    }

    return params.toString() ? `/${path}?${params.toString()}` : `/${path}`;
}

/**
 * Creates a safe filename from entity name
 */
export function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * Determines the subdirectory for an entity based on its type and configuration
 */
export function getEntitySubdirectory(config: any, entityType: "models" | "methods"): string {
    if (entityType === "models") {
        return config.categories?.subtype || "unknown";
    } else {
        // Methods: use primary unit type or method type
        if (config.units && config.units.length > 0) {
            return config.units[0].categories?.type || "unknown";
        } else if (config.categories?.type) {
            return config.categories.type;
        }
        return "unknown";
    }
}

/**
 * Processes entity path based on type
 */
export function processEntityPath(config: any, entityType: "models" | "methods", pathSeparator = "::"): void {
    if (entityType === "methods" && config.units) {
        config.units.forEach((unit: any) => {
            unit.path = encodeDataAsURLPath(unit);
            delete unit.schema;
        });
        config.path = config.units.map((u: any) => u.path).join(pathSeparator);
    } else {
        config.path = encodeDataAsURLPath(config);
    }
}

/**
 * Processes a single YAML file and generates individual JSON files
 */
export function processEntityFile(filePath: string, buildConfig: BuildConfig): void {
    console.log(`Processing ${buildConfig.entityType} file: ${filePath}`);

    const fileContent = fs.readFileSync(filePath, "utf-8");
    let parsed: any;

    try {
        parsed = yaml.load(fileContent, { schema: JsYamlAllSchemas }) as any;
    } catch (error: any) {
        console.log(`  Skipping ${filePath} due to YAML processing error: ${error.message}`);
        return;
    }

    // Handle different parsing structures
    let configs: any[];
    if (buildConfig.entityType === "models") {
        // Models: handle both single configs and objects with multiple configs
        configs = lodash.isPlainObject(parsed) && !parsed.name
            ? Object.values(parsed).flat()
            : Array.isArray(parsed) ? parsed : [parsed];
    } else {
        // Methods: typically arrays of method configs
        configs = Array.isArray(parsed) ? parsed : [parsed];
    }

    configs.forEach((config: any) => {
        // Skip configs without names
        if (!config.name) {
            console.log(`  Skipping config without name in ${filePath}`);
            return;
        }

        // Process path based on entity type
        processEntityPath(config, buildConfig.entityType, buildConfig.pathSeparator);

        // Remove schema if present
        delete config.schema;

        // Determine subdirectory
        const subtype = getEntitySubdirectory(config, buildConfig.entityType);
        const targetDir = path.join(buildConfig.dataPath, subtype);

        // Create directory if it doesn't exist
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Create filename
        const filename = `${createSafeFilename(config.name)}.json`;
        const targetPath = path.join(targetDir, filename);

        // Write JSON file
        fs.writeFileSync(targetPath, JSON.stringify(config, null, 2), "utf8");
        console.log(`  Created: ${targetPath}`);
    });
}





/**
 * Clears existing data directory (except categories.yml)
 */
export function clearDataDirectory(dataPath: string): void {
    if (fs.existsSync(dataPath)) {
        const items = fs.readdirSync(dataPath);
        items.forEach((item) => {
            if (item !== "categories.yml") {
                const itemPath = path.join(dataPath, item);
                if (fs.statSync(itemPath).isDirectory()) {
                    fs.rmSync(itemPath, { recursive: true });
                } else {
                    fs.unlinkSync(itemPath);
                }
            }
        });
    }
}

/**
 * Counts JSON files in a directory recursively
 */
export function countJsonFiles(dir: string): number {
    let count = 0;
    if (fs.existsSync(dir)) {
        const items = fs.readdirSync(dir);
        items.forEach((item) => {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                count += countJsonFiles(fullPath);
            } else if (item.endsWith(".json")) {
                count++;
            }
        });
    }
    return count;
}

/**
 * Main build function that processes all YAML files and generates JSON files
 */
export function buildEntities(buildConfig: BuildConfig): void {
    try {
        // Clear existing data directory (except categories.yml)
        clearDataDirectory(buildConfig.dataPath);

        // Process all YAML files
        const yamlFiles = getFilesInDirectory(buildConfig.sourcesPath, [".yml", ".yaml"], true);

        yamlFiles.forEach((filePath) => {
            processEntityFile(filePath, buildConfig);
        });

        // Categories.yml files are maintained manually

        // Count total generated files
        const totalFiles = countJsonFiles(buildConfig.dataPath);
        console.log(
            `\nGenerated ${totalFiles} ${buildConfig.entityType} JSON files from ${yamlFiles.length} YAML sources`,
        );

    } catch (error) {
        console.error(`Error building ${buildConfig.entityType}:`, error);
        process.exit(1);
    }
}
