const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const lodash = require("lodash");
const utils = require("@mat3ra/code/dist/js/utils");

function buildAsset({ assetPath, targetPath, workingDir = null }) {
    const originalCwd = process.cwd();

    try {
        if (workingDir) {
            process.chdir(path.resolve(originalCwd, workingDir));
        }

        const fileContent = fs.readFileSync(assetPath);
        const obj = yaml.load(fileContent, { schema: utils.JsYamlAllSchemas });

        fs.writeFileSync(
            path.resolve(originalCwd, targetPath),
            JSON.stringify(obj, null, 2),
            "utf8",
        );
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
        return obj;
    } finally {
        process.chdir(originalCwd);
    }
}

/**
 * Reads asset file and stores asset data in target object under object path which reflects the file system.
 * @param {Object} targetObject - Object in which asset data should be stored
 * @param {string} assetPath - Absolute path to asset file.
 * @param {string} assetRoot - Path to asset root directory to construct relative path.
 */
function loadAndInsertAssetData(targetObject, assetPath, assetRoot) {
    const fileContent = fs.readFileSync(assetPath, "utf8");
    const data = yaml.load(fileContent, { schema: utils.JsYamlAllSchemas });
    const objectPath = utils.createObjectPathFromFilePath(assetPath, assetRoot);
    lodash.set(targetObject, objectPath, data);
}

/**
 * Traverse asset folder recursively and load asset files.
 * @param currPath {string} - path to asset directory
 * @param {Object} targetObj - Object in which assets are assigned
 * @param {string} assetRoot - Path to asset root directory to construct relative path.
 */
const getAssetData = (currPath, targetObj, assetRoot) => {
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
};


buildAsset({
    assetPath: "templates/templates.yml",
    targetPath: "./applications/templatesByApplication.json",
    workingDir: "./applications/sources",
});

buildAsset({
    assetPath: "applications/application_data.yml",
    targetPath: "./applications/applicationDataByApplication.json",
    workingDir: "./applications/sources",
});

buildAsset({
    assetPath: "executables/tree.yml",
    targetPath: "./applications/executableFlavorByApplication.json",
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

Object.keys(cleanApplicationData).forEach((appName) => {
    const config = cleanApplicationData[appName];
    const appDir = path.resolve(__dirname, "..", "applications", appName);
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir, { recursive: true });
    }
    const filePath = path.resolve(appDir, `${appName}.json`);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
    console.log(`Generated application: ${appName}/${appName}.json`);
});


const applicationDataByApplication = cleanApplicationData;

const modelMethodMapByApplication = {
    models: MODEL_FILTER_TREE,
    methods: METHOD_FILTER_TREE,
};

fs.writeFileSync(
    path.resolve(__dirname, "..", "applicationDataByApplication.json"),
    JSON.stringify(applicationDataByApplication, null, 2),
    "utf8",
);

fs.writeFileSync(
    path.resolve(__dirname, "..", "modelMethodMapByApplication.json"),
    JSON.stringify(modelMethodMapByApplication, null, 2),
    "utf8",
);

console.log("Generated consolidated model and method mapping: modelMethodMapByApplication.json");
