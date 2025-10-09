import * as utils from "@mat3ra/code/dist/js/utils";
import serverUtils from "@mat3ra/utils/server";
import path from "path";

import BUILD_CONFIG from "../../build-config";
import { ApplicationVersionsMapType } from "../../src/js/types/application";
import { ApplicationVersionsMap } from "../../src/js/utils/applicationVersionMap";
import {
    buildJSONFromYAMLInDir,
    flattenNestedObjects,
    loadYAMLTree,
    resolveFromRoot,
} from "../utils";

type NestedApplicationData = Record<string, Record<string, ApplicationVersionsMapType>>;

buildJSONFromYAMLInDir({
    assetPath: BUILD_CONFIG.applications.assets.templates,
    targetPath: `${BUILD_CONFIG.applications.build.path}/${BUILD_CONFIG.applications.build.templatesList}`,
    workingDir: BUILD_CONFIG.applications.assets.path,
    spaces: 0,
});

buildJSONFromYAMLInDir({
    assetPath: BUILD_CONFIG.applications.assets.executableTree,
    targetPath: `${BUILD_CONFIG.applications.build.path}/${BUILD_CONFIG.applications.build.executableFlavorMapByApplication}`,
    workingDir: BUILD_CONFIG.applications.assets.path,
    spaces: 0,
});

const APPLICATION_ASSET_PATH = resolveFromRoot(
    __dirname,
    BUILD_CONFIG.applications.assets.path,
    BUILD_CONFIG.applications.assets.applications,
);
const MODEL_ASSET_PATH = resolveFromRoot(
    __dirname,
    BUILD_CONFIG.applications.assets.path,
    BUILD_CONFIG.applications.assets.models,
);
const METHOD_ASSET_PATH = resolveFromRoot(
    __dirname,
    BUILD_CONFIG.applications.assets.path,
    BUILD_CONFIG.applications.assets.methods,
);

const APPLICATION_DATA = loadYAMLTree(
    APPLICATION_ASSET_PATH,
    utils.createObjectPathFromFilePath,
) as NestedApplicationData;
const MODEL_FILTER_TREE = loadYAMLTree(MODEL_ASSET_PATH, utils.createObjectPathFromFilePath);
const METHOD_FILTER_TREE = loadYAMLTree(METHOD_ASSET_PATH, utils.createObjectPathFromFilePath);

const cleanApplicationData = flattenNestedObjects(APPLICATION_DATA);

Object.keys(cleanApplicationData).forEach((appName) => {
    const applicationDataForVersions = cleanApplicationData[appName];
    const appVersionsMap = new ApplicationVersionsMap(applicationDataForVersions);
    const { versionConfigsFull } = appVersionsMap;

    const appDir = resolveFromRoot(__dirname, BUILD_CONFIG.applications.data.path, appName);
    serverUtils.file.createDirIfNotExistsSync(appDir);

    versionConfigsFull.forEach((versionConfigFull) => {
        const fileName = appVersionsMap.getSlugForVersionConfig(versionConfigFull);
        const filePath = path.resolve(appDir, fileName);
        serverUtils.json.writeJSONFileSync(filePath, versionConfigFull, {
            spaces: BUILD_CONFIG.jsonFormat.spaces,
        });
        console.log(`Generated application version: ${appName}/${fileName}`);
    });
});

const modelMethodMapByApplication = {
    models: MODEL_FILTER_TREE,
    methods: METHOD_FILTER_TREE,
};

serverUtils.json.writeJSONFileSync(
    resolveFromRoot(
        __dirname,
        BUILD_CONFIG.applications.build.path,
        BUILD_CONFIG.applications.build.applicationVersionsMapByApplication,
    ),
    cleanApplicationData,
);

serverUtils.json.writeJSONFileSync(
    resolveFromRoot(
        __dirname,
        BUILD_CONFIG.applications.build.path,
        BUILD_CONFIG.applications.build.modelMethodMapByApplication,
    ),
    modelMethodMapByApplication,
);

console.log("✅ All application assets built successfully!");
