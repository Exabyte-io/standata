// eslint-disable-next-line import/no-extraneous-dependencies
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as fs from "fs";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { RuntimeData, StandataConfig } from "../../src/js/types/standata";
import { encodeDataAsURLPath, readYAMLFileResolved, resolveFromRoot } from "../utils";

export interface EntityProcessorOptions {
    rootDir: string;
    entityNamePlural: string;
    assetsDir: string;
    dataDir: string;
    buildDir: string;
    categoriesRelativePath: string;
    categoryKeys?: string[];
    excludedAssetFiles?: string[];
}

export type AssetRecord = {
    sourceFile: string;
    entities: any[];
};

export abstract class EntityProcessor {
    protected readonly options: EntityProcessorOptions;

    protected readonly resolvedPaths: {
        assetsDir: string;
        srcPythonDataDir: string;
        dataDir: string;
        buildDir: string;
        distRuntimeDir?: string;
    };

    protected assets: AssetRecord[] = [];

    distRuntimeDir = BUILD_CONFIG.distRuntimeDataDir;

    srcPythonDataDir = BUILD_CONFIG.srcPythonRuntimeDataDir;

    constructor(options: EntityProcessorOptions) {
        this.options = options;
        this.resolvedPaths = {
            assetsDir: resolveFromRoot(options.rootDir, options.assetsDir),
            srcPythonDataDir: resolveFromRoot(options.rootDir, this.srcPythonDataDir),
            dataDir: resolveFromRoot(options.rootDir, options.dataDir),
            buildDir: resolveFromRoot(options.rootDir, options.buildDir),
            distRuntimeDir: resolveFromRoot(options.rootDir, this.distRuntimeDir),
        };
    }

    // Hooks
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    protected transformEntity(entity: any, _sourceFile: string): any {
        return entity;
    }

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    protected getDataSubdirectory(_entity: any, _sourceFile: string): string {
        return "";
    }

    // eslint-disable-next-line class-methods-use-this
    protected additionalProcessing(): void {}

    // eslint-disable-next-line class-methods-use-this
    protected getBuildArtifacts(): { relativePath: string; content: any }[] {
        return [];
    }

    // Default implementations
    public readAssets(): AssetRecord[] {
        const yamlFiles = serverUtils.file.getFilesInDirectory(this.resolvedPaths.assetsDir, [
            ".yml",
            ".yaml",
        ]);
        const excludeFiles = this.getExcludedAssetFiles();

        this.assets = yamlFiles
            .filter((filePath: string) => {
                const basename = path.basename(filePath);
                return !excludeFiles.includes(basename);
            })
            .map((filePath: string) => {
                const parsed = readYAMLFileResolved(filePath);
                const entities = Utils.array.normalizeToArray(parsed);
                return { sourceFile: filePath, entities } as AssetRecord;
            });
        return this.assets;
    }

    protected getExcludedAssetFiles(): string[] {
        const excludeFiles: string[] = [...(this.options.excludedAssetFiles || [])];
        if (this.options.categoriesRelativePath) {
            excludeFiles.push(path.basename(this.options.categoriesRelativePath));
        }
        return excludeFiles;
    }

    public writeBuildDirectoryContent(): void {
        if (!this.resolvedPaths.buildDir) return;
        serverUtils.file.createDirIfNotExistsSync(this.resolvedPaths.buildDir);
        const artifacts = this.getBuildArtifacts();
        artifacts.forEach(({ relativePath, content }) => {
            const targetPath = path.resolve(this.resolvedPaths.buildDir as string, relativePath);
            serverUtils.file.createDirIfNotExistsSync(path.dirname(targetPath));
            serverUtils.json.writeJSONFileSync(targetPath, content, {
                spaces: BUILD_CONFIG.jsonFormat.spaces,
            });
            console.log(`  Built: ${targetPath}`);
        });
    }

    public writeDataDirectoryContent(): void {
        const { dataDir } = this.resolvedPaths;
        serverUtils.file.createDirIfNotExistsSync(dataDir);

        const categoryKeys = this.options.categoryKeys || [];
        this.assets.forEach(({ sourceFile, entities }) => {
            entities.forEach((entity: any) => {
                const transformed = this.transformEntity({ ...entity }, sourceFile);
                if (!transformed.path && categoryKeys.length > 0) {
                    transformed.path = encodeDataAsURLPath(transformed, categoryKeys);
                }
                delete transformed.schema;

                const subdir = this.getDataSubdirectory(transformed, sourceFile);
                const targetDir = path.join(dataDir, subdir);
                const filename = `${Utils.str.createSafeFilename(
                    transformed.name || "entity",
                )}.json`;
                const targetPath = path.join(targetDir, filename);
                serverUtils.json.writeJSONFileSync(targetPath, transformed, {
                    spaces: BUILD_CONFIG.jsonFormat.spaces,
                });
                console.log(`  Created: ${targetPath}`);
            });
        });
    }

    public writeDistDirectoryContent(): void {
        const entityRuntimeDir = path.resolve(
            this.resolvedPaths.distRuntimeDir as string,
            Utils.str.createSafeFilename(this.options.entityNamePlural),
        );
        serverUtils.file.createDirIfNotExistsSync(entityRuntimeDir);

        this.copyJsonFiles(this.resolvedPaths.dataDir, entityRuntimeDir);
        this.copyJsonFiles(this.resolvedPaths.buildDir, entityRuntimeDir);
    }

    // eslint-disable-next-line class-methods-use-this
    public updateCategoriesFile(): void {}

    // Runtime data generation

    get categoriesPath(): string {
        return path.resolve(
            resolveFromRoot(this.options.rootDir, this.options.assetsDir),
            this.options.categoriesRelativePath,
        );
    }

    get runtimeDataJsPath(): string {
        return path.resolve(
            this.resolvedPaths.distRuntimeDir as string,
            `${Utils.str.createSafeFilename(this.options.entityNamePlural)}.json`,
        );
    }

    get runtimeDataPyPath(): string {
        return path.resolve(
            this.resolvedPaths.srcPythonDataDir as string,
            `${Utils.str.createSafeFilename(this.options.entityNamePlural)}.py`,
        );
    }

    protected generateRuntimeDataConfig(): RuntimeData {
        // Read categories YAML
        const categoriesContent: any = serverUtils.yaml.readYAMLFileSync(this.categoriesPath);
        const { entities } = categoriesContent;

        // Build runtime data object
        const runtimeDataConfig: RuntimeData = {
            standataConfig: categoriesContent as StandataConfig,
            filesMapByName: {},
        };

        // Load each entity's JSON file
        entities.forEach((entity: any) => {
            const entityPath = path.join(this.resolvedPaths.dataDir, entity.filename);
            console.log(`  Loading entity file: ${entityPath}`);
            if (fs.existsSync(entityPath)) {
                console.log(`    Found. Loading...`);
                const content = serverUtils.json.readJSONFileSync(entityPath);
                runtimeDataConfig.filesMapByName[entity.filename] = content;
            } else {
                console.warn(`  Warning: Entity file not found: ${entityPath}`);
            }
        });
        return runtimeDataConfig;
    }

    static createJsRuntimeFile(content: object, fullPath: string): void {
        serverUtils.json.writeJSONFileSync(fullPath, content, { spaces: 0 });
        console.log(`Written JS runtime data to "${fullPath}"`);
    }

    static createPythonRuntimeModule(content: object, fullPath: string): void {
        const pyContent = `import json\n\n${fullPath}_data = json.loads(r'''${JSON.stringify(
            content,
        )}''')\n`;
        fs.writeFileSync(fullPath, pyContent, "utf8");
        console.log(`Written Python Module to "${fullPath}"`);
    }

    protected generateRuntimeFiles() {
        const runtimeData = this.generateRuntimeDataConfig();
        EntityProcessor.createJsRuntimeFile(runtimeData, this.runtimeDataJsPath);
        EntityProcessor.createPythonRuntimeModule(runtimeData, this.runtimeDataPyPath);
    }

    // End of Runtime data generation

    public process(): void {
        console.log(`▶ Processing ${this.options.entityNamePlural} ...`);
        this.readAssets();
        this.writeBuildDirectoryContent();
        this.writeDataDirectoryContent();
        this.writeDistDirectoryContent();
        this.generateRuntimeFiles();
        this.updateCategoriesFile();
        this.additionalProcessing();
        console.log(`✅ ${this.options.entityNamePlural} completed.`);
    }

    protected copyJsonFiles(fromDir: string | undefined, destinationBaseDir: string): void {
        if (!fromDir || !fs.existsSync(fromDir)) return;
        const files = serverUtils.file.getFilesInDirectory(fromDir, [".json"]);
        files.forEach((filePath: string) => {
            const relativePath = path.relative(fromDir, filePath);
            const destinationPath = path.resolve(destinationBaseDir, relativePath);
            serverUtils.file.createDirIfNotExistsSync(path.dirname(destinationPath));
            const content = serverUtils.json.readJSONFileSync(filePath);
            serverUtils.json.writeJSONFileSync(destinationPath, content, { spaces: 0 });
            console.log(`  Dist: ${destinationPath}`);
        });
    }

    protected findJsonFilesRecursively(dir: string): string[] {
        return serverUtils.file.getFilesInDirectory(dir, [".json"]);
    }
}
