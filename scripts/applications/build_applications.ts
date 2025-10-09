import * as utils from "@mat3ra/code/dist/js/utils";
import { Utils } from "@mat3ra/utils";
import serverUtils from "@mat3ra/utils/server";
import path from "path";

import BUILD_CONFIG from "../../build-config";
import { ApplicationVersionsMapType } from "../../src/js/types/application";
import { ApplicationVersionsMap } from "../../src/js/utils/applicationVersionMap";
import { BaseEntityDataBuilder } from "../BaseEntityDataBuilder";
import { buildJSONFromYAMLInDir, loadYAMLTree, resolveFromRoot } from "../utils";

type NestedApplicationData = Record<string, Record<string, ApplicationVersionsMapType>>;

class ApplicationDataBuilder extends BaseEntityDataBuilder {
    private buildPath: string;

    constructor(assetsPath: string, dataPath: string, buildPath: string) {
        const applicationsPath = path.join(
            assetsPath,
            BUILD_CONFIG.applications.assets.applications,
        );
        super({ assetsPath: applicationsPath, dataPath });
        this.buildPath = buildPath;
    }

    protected getSubdirectory(entity: any, _sourceFile: string): string {
        return entity.name || "";
    }

    protected shouldProcessEntity(entity: any): boolean {
        return entity.name && entity.versions && Array.isArray(entity.versions);
    }

    protected processEntity(entity: any, _sourceFile: string): void {
        const appName = entity.name;
        const appVersionsMap = new ApplicationVersionsMap(entity);
        const { versionConfigsFull } = appVersionsMap;

        const appDir = resolveFromRoot(__dirname, this.dataPath, appName);
        serverUtils.file.createDirIfNotExistsSync(appDir);

        versionConfigsFull.forEach((versionConfigFull) => {
            const fileName = appVersionsMap.getSlugForVersionConfig(versionConfigFull);
            const filePath = path.resolve(appDir, fileName);
            this.writeJSON(versionConfigFull, filePath, BUILD_CONFIG.jsonFormat.spaces);
            console.log(`Generated application version: ${appName}/${fileName}`);
        });
    }

    buildMaps(): void {
        this.buildTemplates();
        this.buildExecutableTree();
        this.buildApplicationVersionsMap();
        this.buildModelMethodMapByApplication();
    }

    private buildTemplates(): void {
        buildJSONFromYAMLInDir({
            assetPath: BUILD_CONFIG.applications.assets.templates,
            targetPath: `${this.buildPath}/${BUILD_CONFIG.applications.build.templatesList}`,
            workingDir: BUILD_CONFIG.applications.assets.path,
            spaces: 0,
        });
    }

    private buildExecutableTree(): void {
        buildJSONFromYAMLInDir({
            assetPath: BUILD_CONFIG.applications.assets.executableTree,
            targetPath: `${this.buildPath}/${BUILD_CONFIG.applications.build.executableFlavorMapByApplication}`,
            workingDir: BUILD_CONFIG.applications.assets.path,
            spaces: 0,
        });
    }

    private buildApplicationVersionsMap(): void {
        const applicationAssetPath = resolveFromRoot(
            __dirname,
            BUILD_CONFIG.applications.assets.path,
            BUILD_CONFIG.applications.assets.applications,
        );
        const applicationData = loadYAMLTree(
            applicationAssetPath,
            utils.createObjectPathFromFilePath,
        ) as NestedApplicationData;
        const cleanApplicationData = Utils.object.flattenNestedObjects(applicationData);

        const applicationVersionsMapPath = resolveFromRoot(
            __dirname,
            this.buildPath,
            BUILD_CONFIG.applications.build.applicationVersionsMapByApplication,
        );
        this.writeJSON(cleanApplicationData, applicationVersionsMapPath);
    }

    private buildModelMethodMapByApplication(): void {
        const modelAssetPath = resolveFromRoot(
            __dirname,
            BUILD_CONFIG.applications.assets.path,
            BUILD_CONFIG.applications.assets.models,
        );
        const methodAssetPath = resolveFromRoot(
            __dirname,
            BUILD_CONFIG.applications.assets.path,
            BUILD_CONFIG.applications.assets.methods,
        );

        const modelMethodMapByApplication = {
            models: loadYAMLTree(modelAssetPath, utils.createObjectPathFromFilePath),
            methods: loadYAMLTree(methodAssetPath, utils.createObjectPathFromFilePath),
        };

        const modelMethodMapPath = resolveFromRoot(
            __dirname,
            this.buildPath,
            BUILD_CONFIG.applications.build.modelMethodMapByApplication,
        );
        this.writeJSON(modelMethodMapByApplication, modelMethodMapPath);
    }
}

const builder = new ApplicationDataBuilder(
    BUILD_CONFIG.applications.assets.path,
    BUILD_CONFIG.applications.data.path,
    BUILD_CONFIG.applications.build.path,
);

builder.build();
builder.buildMaps();

console.log("✅ All application assets built successfully!");
