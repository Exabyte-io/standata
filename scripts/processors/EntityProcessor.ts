// eslint-disable-next-line import/no-extraneous-dependencies
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as fs from "fs";
import * as path from "path";

import BUILD_CONFIG from "../../build-config";
import { encodeDataAsURLPath, resolveFromRoot, readYAMLFileResolved } from "../utils";

export interface EntityProcessorOptions {
    rootDir: string;
    entityName: string;
    assetsDir: string;
    dataDir: string;
    buildDir?: string;
    distRuntimeDir?: string;
    categoriesRelativePath?: string;
    categoryKeys?: string[];
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
            buildDir: options.buildDir ? resolveFromRoot(options.rootDir, options.buildDir) : undefined,
            distRuntimeDir: options.distRuntimeDir
                ? resolveFromRoot(options.rootDir, options.distRuntimeDir)
                : resolveFromRoot(options.rootDir, BUILD_CONFIG.runtimeDataDir),
        };
    }

    // Hooks
    // eslint-disable-next-line class-methods-use-this
    protected onBeforeBuildDirectoryContent(): void {}
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
        const yamlFiles = serverUtils.file.getFilesInDirectory(this.resolved.assetsDir, [".yml", ".yaml"]);
        this.assets = yamlFiles.map((filePath: string) => {
            const parsed = readYAMLFileResolved(filePath);
            const entities = Utils.array.normalizeToArray(parsed);
            return { sourceFile: filePath, entities } as AssetRecord;
        });
        return this.assets;
    }

    public writeBuildDirectoryContent(): void {
        if (!this.resolved.buildDir) return;
        serverUtils.file.createDirIfNotExistsSync(this.resolved.buildDir);
        this.onBeforeBuildDirectoryContent();
        const artifacts = this.getBuildArtifacts();
        artifacts.forEach(({ relativePath, content }) => {
            const targetPath = path.resolve(this.resolved.buildDir as string, relativePath);
            serverUtils.file.createDirIfNotExistsSync(path.dirname(targetPath));
            serverUtils.json.writeJSONFileSync(targetPath, content, { spaces: BUILD_CONFIG.jsonFormat.spaces });
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
                const filename = `${Utils.str.createSafeFilename(transformed.name || "entity")}.json`;
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

        const copyJsonFiles = (fromDir: string | undefined) => {
            if (!fromDir || !fs.existsSync(fromDir)) return;
            const files = serverUtils.file.getFilesInDirectory(fromDir, [".json"]);
            files.forEach((filePath: string) => {
                const rel = path.relative(fromDir, filePath);
                const destPath = path.resolve(entityRuntimeDir, rel);
                serverUtils.file.createDirIfNotExistsSync(path.dirname(destPath));
                const content = serverUtils.json.readJSONFileSync(filePath);
                serverUtils.json.writeJSONFileSync(destPath, content, { spaces: 0 });
                console.log(`  Dist: ${destPath}`);
            });
        };

        copyJsonFiles(this.resolved.dataDir);
        copyJsonFiles(this.resolved.buildDir);
    }

    // eslint-disable-next-line class-methods-use-this
    public updateCategoriesFile(): void {}

    public process(): void {
        console.log(`▶ Processing ${this.options.entityName} ...`);
        this.readAssets();
        this.writeBuildDirectoryContent();
        this.writeDataDirectoryContent();
        this.writeDistDirectoryContent();
        this.updateCategoriesFile();
        this.additionalProcessing();
        console.log(`✅ ${this.options.entityName} completed.`);
    }
}


