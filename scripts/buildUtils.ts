import * as lodash from "lodash";
import * as path from "path";

import {
    clearDirectory,
    createSafeFilename,
    findFiles,
    readYamlFile,
    writeJsonFile,
} from "./utils";

export interface EntityProcessorConfig {
    sourcesPath: string;
    dataPath: string;
    processEntity: (entity: any, sourceFile: string) => void;
    getSubdirectory: (entity: any, sourceFile: string) => string;
    categoriesFile: string;
}

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

export function normalizeToArray(data: any): any[] {
    if (Array.isArray(data)) return data;
    if (lodash.isPlainObject(data) && !data.name) {
        return Object.values(data).flat();
    }
    return [data];
}

export function saveEntity(entity: any, subdirectory: string, dataPath: string): void {
    const targetDir = path.join(dataPath, subdirectory);
    const filename = `${createSafeFilename(entity.name)}.json`;
    const targetPath = path.join(targetDir, filename);

    writeJsonFile(targetPath, entity);
    console.log(`  Created: ${targetPath}`);
}

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

export function buildEntities(config: EntityProcessorConfig): void {
    const { categoriesFile } = config;
    clearDirectory(config.dataPath, categoriesFile);

    const yamlFiles = findFiles(config.sourcesPath, [".yml", ".yaml"]);

    yamlFiles.forEach((file) => processFile(file, config.processEntity));
}
