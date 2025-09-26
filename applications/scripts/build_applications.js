const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const lodash = require("lodash");
const utils = require("@mat3ra/code/dist/js/utils");
const BUILD_CONFIG = require("../../build-config");

function buildAsset({ assetPath, targetPath, workingDir = null }) {
    const originalCwd = process.cwd();

    try {
        if (workingDir) {
            process.chdir(path.resolve(originalCwd, workingDir));
        }

        const fileContent = fs.readFileSync(assetPath);
        const obj = yaml.load(fileContent, { schema: utils.JsYamlAllSchemas });

        fs.writeFileSync(path.resolve(originalCwd, targetPath), JSON.stringify(obj), "utf8");
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
        return obj;
    } finally {
        process.chdir(originalCwd);
    }
}

function loadAndInsertAssetData(targetObject, assetPath, assetRoot) {
    const fileContent = fs.readFileSync(assetPath, "utf8");
    const data = yaml.load(fileContent, { schema: utils.JsYamlAllSchemas });
    const objectPath = utils.createObjectPathFromFilePath(assetPath, assetRoot);
    lodash.set(targetObject, objectPath, data);
}

function getAssetData(currPath, targetObj, assetRoot) {
    const branches = utils.getDirectories(currPath);
    const assetFiles = utils.getFilesInDirectory(currPath, [".yml", ".yaml"], false);

    assetFiles.forEach((asset) => {
        try {
            loadAndInsertAssetData(targetObj, path.join(currPath, asset), assetRoot);
        } catch (e) {
            console.log(e);
        }
    });
    branches.forEach((b) => {
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

const cleanApplicationData = {};

Object.values(APPLICATION_DATA).forEach((levelData) => {
    if (levelData && typeof levelData === "object") {
        Object.values(levelData).forEach((appData) => {
            if (appData && typeof appData === "object" && appData.name) {
                cleanApplicationData[appData.name] = appData;
            }
        });
    }
});

// Generate individual JSON files for each application version
function createVersionConfig(appConfig, version) {
    return {
        name: appConfig.name,
        shortName: appConfig.shortName,
        summary: appConfig.summary,
        version: version.version,
        build: version.build || "Default",
        isDefault: version.isDefault || false,
        hasAdvancedComputeOptions: version.hasAdvancedComputeOptions || false,
        isLicensed: false,
    };
}

function generateVersionFileName(appName, version) {
    const buildSuffix = version.build ? `_${version.build.toLowerCase()}` : "";
    const versionSuffix = version.version.replace(/\./g, "");
    return `${appName}${buildSuffix}_${versionSuffix}.json`;
}

Object.keys(cleanApplicationData).forEach((appName) => {
    const appConfig = cleanApplicationData[appName];
    const appDir = path.resolve(__dirname, "..", "data", appName);

    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }

    appConfig.versions.forEach((version) => {
        const versionConfig = createVersionConfig(appConfig, version);
        const fileName = generateVersionFileName(appName, version);
        const filePath = path.resolve(appDir, fileName);

        fs.writeFileSync(filePath, JSON.stringify(versionConfig), "utf8");
        console.log(`Generated application version: ${appName}/${fileName}`);
    });
});

const modelMethodMapByApplication = {
    models: MODEL_FILTER_TREE,
    methods: METHOD_FILTER_TREE,
};

fs.writeFileSync(
    path.resolve(__dirname, "..", BUILD_CONFIG.applications.modelMethodMapByApplication),
    JSON.stringify(modelMethodMapByApplication),
    "utf8",
);

console.log("✅ All application assets built successfully!");
