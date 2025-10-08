import * as lodash from "lodash";
import * as path from "path";

import {
    clearDirectory,
    createSafeFilename,
    findFiles,
    readYamlFile,
    writeJsonFile,
} from "./utils";

export interface BuilderConfig {
    sourcesPath: string;
    dataPath: string;
    entityType: string;
}

/**
 * Abstract base class for building entity JSON files from YAML sources.
 *
 * Handles common build workflow:
 * 1. Clears output directory (excluding categories.yml)
 * 2. Finds all YAML files in source directory
 * 3. Parses and normalizes YAML data into entities
 * 4. Processes each entity (implemented by subclass)
 * 5. Saves entities as individual JSON files
 *
 * Subclasses must implement:
 * - processEntity(): Entity-specific processing logic
 * - getSubdirectory(): Output subdirectory determination
 */
export abstract class BaseBuilder {
    protected config: BuilderConfig;

    constructor(config: BuilderConfig) {
        this.config = config;
    }

    /** Process a single entity (implemented by subclass) */
    protected abstract processEntity(entity: any, sourceFile: string): void;

    /** Determine output subdirectory for entity (implemented by subclass) */
    protected abstract getSubdirectory(entity: any, sourceFile: string): string;

    protected parseYamlFile(filePath: string): any[] {
        const parsed = readYamlFile(filePath);
        return this.normalizeToArray(parsed);
    }

    protected normalizeToArray(data: any): any[] {
        if (Array.isArray(data)) return data;
        if (lodash.isPlainObject(data) && !data.name) {
            return Object.values(data).flat();
        }
        return [data];
    }

    protected saveEntity(entity: any, subdirectory: string): void {
        if (!entity.name) {
            console.log("  Skipping entity without name");
            return;
        }

        const targetDir = path.join(this.config.dataPath, subdirectory);
        const filename = `${createSafeFilename(entity.name)}.json`;
        const targetPath = path.join(targetDir, filename);

        writeJsonFile(targetPath, entity);
        console.log(`  Created: ${targetPath}`);
    }

    protected processFile(filePath: string): void {
        console.log(`Processing: ${filePath}`);
        try {
            const entities = this.parseYamlFile(filePath);
            entities.forEach((entity) => this.processEntity(entity, filePath));
        } catch (error: any) {
            console.error(`  Error: ${error.message}`);
        }
    }

    public build(): void {
        clearDirectory(this.config.dataPath, "categories.yml");

        const yamlFiles = findFiles(this.config.sourcesPath, [".yml", ".yaml"]);
        yamlFiles.forEach((file) => this.processFile(file));

        console.log(`\nGenerated from ${yamlFiles.length} YAML sources`);
    }
}
