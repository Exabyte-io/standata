// eslint-disable-next-line import/no-extraneous-dependencies
import * as utils from "@mat3ra/code/dist/js/utils";
import fs from "fs";
import yaml from "js-yaml";
// eslint-disable-next-line import/no-extraneous-dependencies
import lodash from "lodash";
import path from "path";

import BUILD_CONFIG from "../../build-config";
import { ApplicationVersionsMapType } from "../../src/js/types/application";
import { ApplicationVersionsMap } from "../../src/js/utils/applicationVersionMap";

interface BuildAssetParams {
    assetPath: string;
    targetPath: string;
    workingDir?: string | null;
}

function buildAsset({ assetPath, targetPath, workingDir = null }: BuildAssetParams) {
    const originalCwd = process.cwd();

    try {
        if (workingDir) {
            process.chdir(path.resolve(originalCwd, workingDir));
        }

        const fileContent = fs.readFileSync(assetPath) as unknown as string;
        const obj = yaml.load(fileContent, { schema: utils.JsYamlAllSchemas });

        fs.writeFileSync(path.resolve(originalCwd, targetPath), JSON.stringify(obj), "utf8");
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
        return obj;
    } finally {
        process.chdir(originalCwd);
    }
}

function loadAndInsertAssetData(targetObject: object, assetPath: string, assetRoot: string) {
    const fileContent = fs.readFileSync(assetPath, "utf8");
    const data = yaml.load(fileContent, { schema: utils.JsYamlAllSchemas });
    const objectPath = utils.createObjectPathFromFilePath(assetPath, assetRoot);
    lodash.set(targetObject, objectPath, data);
}

function getAssetData(currPath: string, targetObj: object, assetRoot: string) {
    const branches = utils.getDirectories(currPath);
    const assetFiles = utils.getFilesInDirectory(currPath, [".yml", ".yaml"], false);

    assetFiles.forEach((asset) => {
        try {
            loadAndInsertAssetData(targetObj, path.join(currPath, asset), assetRoot);
        } catch (e) {
            console.log(e);
        }
    });
    branches.forEach((b: string) => {
        getAssetData(path.resolve(currPath, b), targetObj, assetRoot);
    });
}

buildAsset({
    assetPath: BUILD_CONFIG.sources.templates,
    targetPath: `./applications/${BUILD_CONFIG.applications.templatesList}`,
    workingDir: "./applications/sources",
});

buildAsset({
    assetPath: BUILD_CONFIG.sources.executableTree,
    targetPath: `./applications/${BUILD_CONFIG.applications.executableFlavorMapByApplication}`,
    workingDir: "./applications/sources",
});

const APPLICATION_ASSET_PATH = path.resolve(__dirname, "../sources/applications");
const MODEL_ASSET_PATH = path.resolve(__dirname, "../sources/models");
const METHOD_ASSET_PATH = path.resolve(__dirname, "../sources/methods");

const APPLICATION_DATA = {};
const MODEL_FILTER_TREE = {};
const METHOD_FILTER_TREE = {};

getAssetData(APPLICATION_ASSET_PATH, APPLICATION_DATA, APPLICATION_ASSET_PATH);
getAssetData(MODEL_ASSET_PATH, MODEL_FILTER_TREE, MODEL_ASSET_PATH);
getAssetData(METHOD_ASSET_PATH, METHOD_FILTER_TREE, METHOD_ASSET_PATH);

const cleanApplicationData = {} as {
    [key: string]: ApplicationVersionsMapType;
};

Object.values(APPLICATION_DATA).forEach((levelData) => {
    if (levelData && typeof levelData === "object") {
        Object.values(levelData).forEach((appData: ApplicationVersionsMapType) => {
            if (appData && typeof appData === "object" && appData.name) {
                cleanApplicationData[appData.name] = appData;
            }
        });
    }
});

Object.keys(cleanApplicationData).forEach((appName) => {
    const applicationDataForVersions = cleanApplicationData[appName];
    const appVersionsMap = new ApplicationVersionsMap(applicationDataForVersions);
    const { versionConfigsFull } = appVersionsMap;

    const appDir = path.resolve(__dirname, "..", "data", appName);
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }

    versionConfigsFull.forEach((versionConfigFull) => {
        const fileName = appVersionsMap.getSlugForVersionConfig(versionConfigFull);
        const filePath = path.resolve(appDir, fileName);
        fs.writeFileSync(filePath, JSON.stringify(versionConfigFull), "utf8");
        console.log(`Generated application version: ${appName}/${fileName}`);
    });
});

const modelMethodMapByApplication = {
    models: MODEL_FILTER_TREE,
    methods: METHOD_FILTER_TREE,
};

fs.writeFileSync(
    path.resolve(__dirname, "..", BUILD_CONFIG.applications.applicationVersionsMapByApplication),
    JSON.stringify(cleanApplicationData),
    "utf8",
);

fs.writeFileSync(
    path.resolve(__dirname, "..", BUILD_CONFIG.applications.modelMethodMapByApplication),
    JSON.stringify(modelMethodMapByApplication),
    "utf8",
);

console.log("✅ All application assets built successfully!");
