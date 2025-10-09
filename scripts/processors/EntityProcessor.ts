// eslint-disable-next-line import/no-extraneous-dependencies
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as fs from "fs";
import * as path from "path";

import BUILD_CONFIG from "../../build-config";
import { encodeDataAsURLPath, readYAMLFileResolved, resolveFromRoot } from "../utils";

export interface EntityProcessorOptions {
    rootDir: string;
    entityName: string;
    assetsDir: string;
    dataDir: string;
    buildDir?: string;
    distRuntimeDir?: string;
    categoriesRelativePath?: string;
    categoryKeys?: string[];
    isCategoriesGenerationEnabled?: boolean;
    excludedAssetFiles?: string[];
}

export type AssetRecord = {
    sourceFile: string;
    entities: any[];
};

export abstract class EntityProcessor {
    protected readonly options: EntityProcessorOptions;

    protected readonly resolved: {
        assetsDir: string;
        dataDir: string;
        buildDir?: string;
        distRuntimeDir?: string;
    };

    protected assets: AssetRecord[] = [];

    constructor(options: EntityProcessorOptions) {
        this.options = options;
        this.resolved = {
            assetsDir: resolveFromRoot(options.rootDir, options.assetsDir),
            dataDir: resolveFromRoot(options.rootDir, options.dataDir),
            buildDir: options.buildDir
                ? resolveFromRoot(options.rootDir, options.buildDir)
                : undefined,
            distRuntimeDir: options.distRuntimeDir
                ? resolveFromRoot(options.rootDir, options.distRuntimeDir)
                : resolveFromRoot(options.rootDir, BUILD_CONFIG.runtimeDataDir),
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
        const yamlFiles = serverUtils.file.getFilesInDirectory(this.resolved.assetsDir, [
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
        if (!this.resolved.buildDir) return;
        serverUtils.file.createDirIfNotExistsSync(this.resolved.buildDir);
        const artifacts = this.getBuildArtifacts();
        artifacts.forEach(({ relativePath, content }) => {
            const targetPath = path.resolve(this.resolved.buildDir as string, relativePath);
            serverUtils.file.createDirIfNotExistsSync(path.dirname(targetPath));
            serverUtils.json.writeJSONFileSync(targetPath, content, {
                spaces: BUILD_CONFIG.jsonFormat.spaces,
            });
            console.log(`  Built: ${targetPath}`);
        });
    }

    public writeDataDirectoryContent(): void {
        const { dataDir } = this.resolved;
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
            this.resolved.distRuntimeDir as string,
            Utils.str.createSafeFilename(this.options.entityName),
        );
        serverUtils.file.createDirIfNotExistsSync(entityRuntimeDir);

        this.copyJsonFiles(this.resolved.dataDir, entityRuntimeDir);
        this.copyJsonFiles(this.resolved.buildDir, entityRuntimeDir);
    }

    // eslint-disable-next-line class-methods-use-this
    public updateCategoriesFile(): void {}

    public process(): void {
        console.log(`▶ Processing ${this.options.entityName} ...`);
        this.readAssets();
        this.writeBuildDirectoryContent();
        this.writeDataDirectoryContent();
        this.writeDistDirectoryContent();
        if (this.options.isCategoriesGenerationEnabled) this.updateCategoriesFile();
        this.additionalProcessing();
        console.log(`✅ ${this.options.entityName} completed.`);
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
        const results: string[] = [];
        const items = fs.readdirSync(dir);
        items.forEach((item) => {
            const full = path.join(dir, item);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) results.push(...this.findJsonFilesRecursively(full));
            else if (stat.isFile() && item.endsWith(".json")) results.push(full);
        });
        return results;
    }
}
