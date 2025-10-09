// eslint-disable-next-line import/no-extraneous-dependencies
import { JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as lodash from "lodash";
import * as path from "path";

import BUILD_CONFIG from "../build-config";

export function readYAMLFile(filePath: string): any {
    const content = fs.readFileSync(filePath, "utf-8");
    return yaml.load(content, { schema: JsYamlAllSchemas });
}

export function resolveFromRoot(scriptDirname: string, ...pathSegments: string[]): string {
    return path.resolve(scriptDirname, "../..", ...pathSegments);
}

/**
 * Creates a filesystem-safe filename from a given name.
 */
export function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * Converts YAML file to JSON, optionally resolving relative includes from a working directory
 */
export function buildJSONFromYAMLInDir({
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

        const data = readYAMLFile(assetPath);
        const resolvedTargetPath = workingDir ? path.resolve(originalCwd, targetPath) : targetPath;

        serverUtils.json.writeJSONFileSync(resolvedTargetPath, data, {
            spaces,
        });
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
export function loadYAMLTree(
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
                const data = readYAMLFile(currentPath);
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
 * Builds entity JSON files from YAML sources when some processing is needed.
 */
export function buildEntities(config: EntityProcessorConfig): void {
    const { categoriesFile } = config;
    serverUtils.file.cleanDirectorySync(config.dataPath, [categoriesFile]);

    const yamlFiles = serverUtils.file.getFilesInDirectory(config.sourcesPath, [".yml", ".yaml"]);

    yamlFiles.forEach((filePath) => {
        try {
            const parsedFile = readYAMLFile(filePath);
            const entities = Utils.array.normalizeToArray(parsedFile);
            entities.forEach((entity) => config.processEntity(entity, filePath));
        } catch (error: any) {
            console.error(`  Error: ${error.message}`);
        }
    });
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
    spaces = BUILD_CONFIG.jsonFormat.spaces,
): void {
    if (!entity.name) return;

    if (!entity.path) {
        entity.path = encodeDataAsURLPath(entity, categoryKeys);
    }
    delete entity.schema;

    const subdirectory = getSubdirectory(entity, sourceFile);
    const targetDir = path.join(dataPath, subdirectory);
    const filename = `${createSafeFilename(entity.name)}.json`;
    const targetPath = path.join(targetDir, filename);

    serverUtils.json.writeJSONFileSync(targetPath, entity, { spaces });
    console.log(`  Created: ${targetPath}`);
}

/**
 * Loads YAML files from a directory and stores them in a map keyed by filename (without extension).
 */
export function loadYAMLFilesAsMap(dirPath: string): Record<string, any> {
    const map: Record<string, any> = {};
    const yamlFiles = serverUtils.file.getFilesInDirectory(dirPath, [".yml", ".yaml"]);

    yamlFiles.forEach((filePath) => {
        const filename = path.basename(filePath);
        const key = filename.replace(/\.(yml|yaml)$/i, "");
        map[key] = readYAMLFile(filePath);
    });

    return map;
}
