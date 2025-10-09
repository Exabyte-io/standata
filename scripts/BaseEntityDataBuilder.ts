import { Utils } from "@mat3ra/utils";
import serverUtils from "@mat3ra/utils/server";
import * as path from "path";

import { readYAMLFileResolved } from "./utils";

export interface EntityDataBuilderConfig {
    assetsPath: string;
    dataPath: string;
    categoriesFile?: string;
}

export abstract class BaseEntityDataBuilder<T = any> {
    protected assetsPath: string;

    protected dataPath: string;

    protected categoriesFile?: string;

    constructor(config: EntityDataBuilderConfig) {
        this.assetsPath = config.assetsPath;
        this.dataPath = config.dataPath;
        this.categoriesFile = config.categoriesFile;
    }

    protected loadYAML(filePath: string): any {
        return readYAMLFileResolved(filePath);
    }

    protected writeJSON(data: any, targetPath: string, spaces = 4): void {
        serverUtils.json.writeJSONFileSync(targetPath, data, { spaces });
    }

    protected getYAMLFiles(): string[] {
        return serverUtils.file.getFilesInDirectory(this.assetsPath, [".yml", ".yaml"]);
    }

    protected cleanDataDirectory(): void {
        const excludeFiles = this.categoriesFile ? [this.categoriesFile] : undefined;
        serverUtils.file.cleanDirectorySync(this.dataPath, excludeFiles);
    }

    protected resolveDataPath(...pathSegments: string[]): string {
        return path.resolve(this.dataPath, ...pathSegments);
    }

    protected resolveAssetPath(...pathSegments: string[]): string {
        return path.resolve(this.assetsPath, ...pathSegments);
    }

    protected processEntity(_entity: T, _sourceFile: string): void {
        throw new Error("processEntity must be implemented by subclass");
    }

    protected getSubdirectory(_entity: T, _sourceFile: string): string {
        return "";
    }

    protected shouldProcessEntity(_entity: T): boolean {
        return true;
    }

    build(): void {
        this.cleanDataDirectory();
        const yamlFiles = this.getYAMLFiles();

        yamlFiles.forEach((filePath) => {
            try {
                const parsedFile = this.loadYAML(filePath);
                const entities = Utils.array.normalizeToArray(parsedFile);

                entities.forEach((entity) => {
                    if (this.shouldProcessEntity(entity)) {
                        this.processEntity(entity, filePath);
                    }
                });
            } catch (error: any) {
                console.error(`Error processing ${filePath}: ${error.message}`);
            }
        });
    }
}
