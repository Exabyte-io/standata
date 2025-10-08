import * as utils from "@mat3ra/code/dist/js/utils";
import path from "path";

import BUILD_CONFIG from "../../build-config";
import { ApplicationVersionsMapType } from "../../src/js/types/application";
import { ApplicationVersionsMap } from "../../src/js/utils/applicationVersionMap";
import {
    buildJsonFromYamlInDir,
    ensureDirectory,
    flattenNestedObjects,
    loadYamlTree,
    resolveFromRoot,
    writeJsonFile,
} from "../utils";

type NestedApplicationData = Record<string, Record<string, ApplicationVersionsMapType>>;

buildJsonFromYamlInDir(
    BUILD_CONFIG.applications.assets.templates,
    `${BUILD_CONFIG.applications.build.path}/${BUILD_CONFIG.applications.build.templatesList}`,
    BUILD_CONFIG.applications.assets.path,
);

buildJsonFromYamlInDir(
    BUILD_CONFIG.applications.assets.executableTree,
    `${BUILD_CONFIG.applications.build.path}/${BUILD_CONFIG.applications.build.executableFlavorMapByApplication}`,
    BUILD_CONFIG.applications.assets.path,
);

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

const APPLICATION_DATA = loadYamlTree(
    APPLICATION_ASSET_PATH,
    utils.createObjectPathFromFilePath,
) as NestedApplicationData;
const MODEL_FILTER_TREE = loadYamlTree(MODEL_ASSET_PATH, utils.createObjectPathFromFilePath);
const METHOD_FILTER_TREE = loadYamlTree(METHOD_ASSET_PATH, utils.createObjectPathFromFilePath);

const cleanApplicationData = flattenNestedObjects(APPLICATION_DATA);

Object.keys(cleanApplicationData).forEach((appName) => {
    const applicationDataForVersions = cleanApplicationData[appName];
    const appVersionsMap = new ApplicationVersionsMap(applicationDataForVersions);
    const { versionConfigsFull } = appVersionsMap;

    const appDir = resolveFromRoot(__dirname, BUILD_CONFIG.applications.data.path, appName);
    ensureDirectory(appDir);

    versionConfigsFull.forEach((versionConfigFull) => {
        const fileName = appVersionsMap.getSlugForVersionConfig(versionConfigFull);
        const filePath = path.resolve(appDir, fileName);
        writeJsonFile(filePath, versionConfigFull);
        console.log(`Generated application version: ${appName}/${fileName}`);
    });
});

const modelMethodMapByApplication = {
    models: MODEL_FILTER_TREE,
    methods: METHOD_FILTER_TREE,
};

writeJsonFile(
    resolveFromRoot(
        __dirname,
        BUILD_CONFIG.applications.build.path,
        BUILD_CONFIG.applications.build.applicationVersionsMapByApplication,
    ),
    cleanApplicationData,
);

writeJsonFile(
    resolveFromRoot(
        __dirname,
        BUILD_CONFIG.applications.build.path,
        BUILD_CONFIG.applications.build.modelMethodMapByApplication,
    ),
    modelMethodMapByApplication,
);

console.log("✅ All application assets built successfully!");
