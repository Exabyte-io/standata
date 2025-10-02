import { getFilesInDirectory, JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as lodash from "lodash";
import * as path from "path";

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
 * Determines the subdirectory for an entity based on source filename and type
 * For methods: extracts from filename (e.g., "pw_methods.yml" → "pw")
 * For models: uses categories.subtype
 */
export function getEntitySubdirectory(
    sourceFilePath: string,
    config: any,
    entityType: "models" | "methods",
): string {
    if (entityType === "models") {
        return config.categories?.subtype || "unknown";
    }

    // Methods: extract subdirectory from source filename
    const basename = path.basename(sourceFilePath, path.extname(sourceFilePath));

    // Remove common suffixes: _methods, _method, etc.
    const subdirectory = basename.replace(/_methods?$/, "").replace(/^(.+)$/, "$1");

    return subdirectory || "unknown";
}

/**
 * Processes entity path based on type to output a URL-encoded path
 */
export function setEntityPathAsURL(
    config: any,
    entityType: "models" | "methods",
    pathSeparator = "::",
): void {
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
        configs =
            lodash.isPlainObject(parsed) && !parsed.name
                ? Object.values(parsed).flat()
                : Array.isArray(parsed)
                ? parsed
                : [parsed];
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
        setEntityPathAsURL(config, buildConfig.entityType, buildConfig.pathSeparator);

        // Remove schema if present
        delete config.schema;

        // Determine subdirectory
        const subtype = getEntitySubdirectory(filePath, config, buildConfig.entityType);
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
 * Clears existing data directory (except excludeFile)
 */
export function clearDataDirectory(dataPath: string, excludeFile = "categories.yml"): void {
    if (fs.existsSync(dataPath)) {
        const items = fs.readdirSync(dataPath);
        items.forEach((item) => {
            if (item !== excludeFile) {
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
 * Main build function that processes all YAML files and generates JSON files
 */
export function buildEntities(buildConfig: BuildConfig): void {
    try {
        // Clear existing data directory (except categories.yml)
        clearDataDirectory(buildConfig.dataPath);

        const yamlFiles = getFilesInDirectory(buildConfig.sourcesPath, [".yml", ".yaml"], true);

        yamlFiles.forEach((filePath) => {
            processEntityFile(filePath, buildConfig);
        });

        console.log(`\nGenerated JSON files from ${yamlFiles.length} YAML sources`);
    } catch (error) {
        console.error(`Error building ${buildConfig.entityType}:`, error);
        process.exit(1);
    }
}
