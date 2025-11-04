// eslint-disable-next-line import/no-extraneous-dependencies
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { ApplicationVersionsMapType } from "../../src/js/types/application";
import { ApplicationVersionsMap } from "../../src/js/utils/applicationVersionMap";
import { buildJSONFromYAMLInDir, loadYAMLTree, resolveFromRoot } from "../utils";
import { EntityProcessor } from "./EntityProcessor";

export class ApplicationsProcessor extends EntityProcessor {
    constructor(rootDir: string) {
        super({
            rootDir,
            entityNamePlural: "applications",
            assetsDir: BUILD_CONFIG.applications.assets.path,
            dataDir: BUILD_CONFIG.applications.data.path,
            buildDir: BUILD_CONFIG.applications.build.path,
            categoriesRelativePath: BUILD_CONFIG.applications.assets.categories,
        });
    }

    private cleanApplicationData: Record<string, ApplicationVersionsMapType> = {} as any;

    private modelFilterTree: Record<string, any> = {};

    private methodFilterTree: Record<string, any> = {};

    public readAssets() {
        const sourcesRoot = resolveFromRoot(
            this.options.rootDir,
            BUILD_CONFIG.applications.assets.path,
        );
        const applicationAssetPath = path.resolve(
            sourcesRoot,
            BUILD_CONFIG.applications.assets.applications,
        );
        const modelAssetPath = path.resolve(sourcesRoot, BUILD_CONFIG.applications.assets.models);
        const methodAssetPath = path.resolve(sourcesRoot, BUILD_CONFIG.applications.assets.methods);

        const nestedApplicationData = loadYAMLTree(applicationAssetPath) as Record<
            string,
            Record<string, ApplicationVersionsMapType>
        >;
        const clean = (Utils.object.flattenNestedObjects as any)(nestedApplicationData);

        this.cleanApplicationData = clean;
        this.modelFilterTree = loadYAMLTree(modelAssetPath);
        this.methodFilterTree = loadYAMLTree(methodAssetPath);

        this.assets = [];
        return this.assets;
    }

    public writeBuildDirectoryContent(): void {
        if (!this.resolvedPaths.buildDir) return;
        serverUtils.file.createDirIfNotExistsSync(this.resolvedPaths.buildDir);

        const targetBuildDir = this.resolvedPaths.buildDir as string;
        const workingDir = BUILD_CONFIG.applications.assets.path;
        buildJSONFromYAMLInDir({
            assetPath: BUILD_CONFIG.applications.assets.templates,
            targetPath: `${targetBuildDir}/${BUILD_CONFIG.applications.build.templatesList}`,
            workingDir,
            spaces: 0,
        });
        buildJSONFromYAMLInDir({
            assetPath: BUILD_CONFIG.applications.assets.executableTree,
            targetPath: `${targetBuildDir}/${BUILD_CONFIG.applications.build.executableFlavorMapByApplication}`,
            workingDir,
            spaces: 0,
        });

        serverUtils.json.writeJSONFileSync(
            path.resolve(
                targetBuildDir,
                BUILD_CONFIG.applications.build.applicationVersionsMapByApplication,
            ),
            this.cleanApplicationData,
        );

        const modelMethodMapByApplication = {
            models: this.modelFilterTree,
            methods: this.methodFilterTree,
        };
        serverUtils.json.writeJSONFileSync(
            path.resolve(
                targetBuildDir,
                BUILD_CONFIG.applications.build.modelMethodMapByApplication,
            ),
            modelMethodMapByApplication,
        );
    }

    public writeDataDirectoryContent(): void {
        const appNames = Object.keys(this.cleanApplicationData);
        appNames.forEach((appName) => {
            const applicationDataForVersions = this.cleanApplicationData[appName];
            const appVersionsMap = new ApplicationVersionsMap(applicationDataForVersions);
            const { versionConfigsFull } = appVersionsMap as any;

            const appDir = path.resolve(this.resolvedPaths.dataDir, appName);
            serverUtils.file.createDirIfNotExistsSync(appDir);
            versionConfigsFull.forEach((versionConfigFull: any) => {
                const fileName = (appVersionsMap as any).getSlugForVersionConfig(versionConfigFull);
                const filePath = path.resolve(appDir, fileName);
                serverUtils.json.writeJSONFileSync(filePath, versionConfigFull, {
                    spaces: BUILD_CONFIG.dataJSONFormat.spaces,
                });
                console.log(`Generated application version: ${appName}/${fileName}`);
            });
        });
    }
}
