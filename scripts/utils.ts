import { JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as lodash from "lodash";
import * as path from "path";

import BUILD_CONFIG from "../build-config";

export function ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export function readYamlFile(filePath: string): any {
    const content = fs.readFileSync(filePath, "utf-8");
    return yaml.load(content, { schema: JsYamlAllSchemas });
}

export function writeYamlFile(filePath: string, data: any): void {
    ensureDirectory(path.dirname(filePath));
    const content = yaml.dump(data, { ...BUILD_CONFIG.yamlFormat });
    fs.writeFileSync(filePath, content, "utf-8");
}

export function readJsonFile(filePath: string): any {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

export function writeJsonFile(filePath: string, data: any, spaces = 0): void {
    ensureDirectory(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, spaces), "utf-8");
}

export function resolveFromRoot(scriptDirname: string, ...pathSegments: string[]): string {
    return path.resolve(scriptDirname, "../..", ...pathSegments);
}

export function findFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...findFiles(fullPath, extensions));
        } else if (extensions.some((ext) => item.endsWith(ext))) {
            files.push(fullPath);
        }
    });

    return files;
}

/**
 * Clears all files and subdirectories in the specified directory,
 * optionally excluding a specific file from deletion.
 */
export function clearDirectory(dirPath: string, excludeFile?: string): void {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);
    items.forEach((item) => {
        if (item === excludeFile) return;

        const itemPath = path.join(dirPath, item);
        if (fs.statSync(itemPath).isDirectory()) {
            fs.rmSync(itemPath, { recursive: true });
        } else {
            fs.unlinkSync(itemPath);
        }
    });
}

export function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * Converts YAML file to JSON, optionally resolving relative includes from a working directory
 */
export function buildJsonFromYamlInDir({
    assetPath,
    targetPath,
    workingDir,
    spaces = 0,
}: {
    assetPath: string;
    targetPath: string;
    workingDir?: string;
    spaces?: number;
}): any {
    const originalCwd = process.cwd();
    try {
        if (workingDir) {
            process.chdir(workingDir);
        }

        const data = readYamlFile(assetPath);
        const resolvedTargetPath = workingDir ? path.resolve(originalCwd, targetPath) : targetPath;

        writeJsonFile(resolvedTargetPath, data, spaces);
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
        return data;
    } finally {
        if (workingDir) {
            process.chdir(originalCwd);
        }
    }
}

/**
 * Loads a directory tree of YAML files into a nested object structure.
 */
export function loadYamlTree(
    rootPath: string,
    createObjectPath: (filePath: string, rootPath: string) => string,
): Record<string, any> {
    const tree: Record<string, any> = {};

    function traverse(currentPath: string) {
        if (!fs.existsSync(currentPath)) return;

        const stat = fs.statSync(currentPath);

        if (stat.isDirectory()) {
            const items = fs.readdirSync(currentPath);
            items.forEach((item) => traverse(path.join(currentPath, item)));
        } else if (stat.isFile() && /\.(yml|yaml)$/i.test(currentPath)) {
            try {
                const data = readYamlFile(currentPath);
                const objectPath = createObjectPath(currentPath, rootPath);
                lodash.set(tree, objectPath, data);
            } catch (error) {
                console.error(`Error loading ${currentPath}:`, error);
            }
        }
    }

    traverse(rootPath);
    return tree;
}

// Functions for processing entities from YAML files to JSON files when some processing inside the files is needed

export interface EntityProcessorConfig {
    sourcesPath: string;
    dataPath: string;
    processEntity: (entity: any, sourceFile: string) => void;
    getSubdirectory: (entity: any, sourceFile: string) => string;
    categoriesFile: string;
}

/**
 * Encodes entity data as a URL path with categories and parameters.
 */
export function encodeDataAsURLPath(
    data: any,
    categoryKeys: string[] = [],
    placeholder = "none",
): string {
    const pathSegments = categoryKeys.map((key) => data.categories?.[key] || placeholder).join("/");

    const params = new URLSearchParams();
    if (data.parameters) {
        Object.entries(data.parameters).forEach(([key, value]) => {
            const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
            params.append(key, stringValue);
        });
    }

    return params.toString() ? `/${pathSegments}?${params.toString()}` : `/${pathSegments}`;
}

/**
 * Normalizes data to an array format for consistent processing.
 */
export function normalizeToArray(data: any): any[] {
    if (Array.isArray(data)) {
        // Flatten nested arrays (e.g., from multiple !combine blocks)
        return data.flat();
    }
    if (lodash.isPlainObject(data) && !data.name) {
        return Object.values(data).flat();
    }
    return [data];
}

/**
 * Saves an entity as a JSON file in the specified subdirectory.
 */
export function saveEntity(entity: any, subdirectory: string, dataPath: string): void {
    const targetDir = path.join(dataPath, subdirectory);
    const filename = `${createSafeFilename(entity.name)}.json`;
    const targetPath = path.join(targetDir, filename);

    writeJsonFile(targetPath, entity);
    console.log(`  Created: ${targetPath}`);
}

/**
 * Processes a single YAML file and extracts entities.
 */
export function processFile(
    filePath: string,
    processEntity: (entity: any, sourceFile: string) => void,
): void {
    console.log(`Processing: ${filePath}`);
    try {
        const parsedFile = readYamlFile(filePath);
        const entities = normalizeToArray(parsedFile);
        entities.forEach((entity) => processEntity(entity, filePath));
    } catch (error: any) {
        console.error(`  Error: ${error.message}`);
    }
}

/**
 * Builds entity JSON files from YAML sources when some processing is needed.
 */
export function buildEntities(config: EntityProcessorConfig): void {
    const { categoriesFile } = config;
    clearDirectory(config.dataPath, categoriesFile);

    const yamlFiles = findFiles(config.sourcesPath, [".yml", ".yaml"]);

    yamlFiles.forEach((file) => processFile(file, config.processEntity));
}

/**
 * Processes and saves an entity with standard operations:
 * encodes path, deletes schema, determines subdirectory, and saves.
 */
export function processAndSaveEntity(
    entity: any,
    sourceFile: string,
    dataPath: string,
    categoryKeys: string[],
    getSubdirectory: (entity: any, sourceFile: string) => string,
): void {
    if (!entity.name) return;

    if (!entity.path) {
        entity.path = encodeDataAsURLPath(entity, categoryKeys);
    }
    delete entity.schema;

    const subdirectory = getSubdirectory(entity, sourceFile);
    saveEntity(entity, subdirectory, dataPath);
}

/**
 * Flattens nested object structure to single-level object.
 * Useful for extracting entities from deeply nested configurations.
 */
export function flattenNestedObjects<T>(
    nestedData: Record<string, Record<string, T>>,
    filterFn?: (item: T) => boolean,
): Record<string, T> {
    const flattened: Record<string, T> = {};

    Object.values(nestedData).forEach((levelData) => {
        Object.values(levelData).forEach((item) => {
            if (item && typeof item === "object" && (item as any).name) {
                if (!filterFn || filterFn(item)) {
                    flattened[(item as any).name] = item;
                }
            }
        });
    });

    return flattened;
}

/**
 * Loads YAML files from a directory and stores them in a map keyed by filename (without extension).
 */
export function loadYamlFilesAsMap(dirPath: string): Record<string, any> {
    const map: Record<string, any> = {};
    const yamlFiles = findFiles(dirPath, [".yml", ".yaml"]);

    yamlFiles.forEach((filePath) => {
        const filename = path.basename(filePath);
        const key = filename.replace(/\.(yml|yaml)$/i, "");
        map[key] = readYamlFile(filePath);
    });

    return map;
}
