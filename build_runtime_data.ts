// @ts-nocheck
/**
 * build_runtime_data uses node API to read all entity category files from the FS
 * at build time and writes them out to JSON files for
 * downstream consumption to avoid FS calls in the browser.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
import fs from "fs";
import yaml from "js-yaml";
import path from "path";

import { BUILD_CONFIG } from "./build-config";

/**
 * Write file and create directory if it doesn't exist
 * @param {string} filePath - Path to the file
 * @param {string} content - Content to write
 * @param {string} encoding - File encoding (default: utf8)
 */
function writeFile(filePath, content, encoding = "utf8") {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, encoding);
}

function buildAsset({
    assetPath,
    targetPath,
    dataPath,
    contentGenerator = (content) => `${JSON.stringify(content)}\n`,
}) {
    const fileContent = fs.readFileSync(assetPath, { encoding: "utf-8" });
    const obj = {};
    obj.standataConfig = yaml.load(fileContent) || {};
    if (!Array.isArray(obj.standataConfig.entities)) {
        obj.standataConfig.entities = [];
    }

    obj.filesMapByName = {};

    const entities = Array.isArray(obj.standataConfig?.entities) ? obj.standataConfig.entities : [];

    // Check duplicate filenames for sanity (only if entities provided)
    if (entities.length > 0) {
        const filenames = entities.map((entity) => entity.filename);
        const duplicateFilenames = filenames.filter(
            (filename, index) => filenames.indexOf(filename) !== index,
        );
        if (duplicateFilenames.length > 0) {
            throw new Error(`Duplicate filenames found in ${assetPath}: ${duplicateFilenames}`);
        }
    }

    // Create JSON
    entities.forEach((entity) => {
        const entityPath = path.join(dataPath, entity.filename);
        const content = fs.readFileSync(path.resolve(entityPath), { encoding: "utf-8" });
        obj.filesMapByName[entity.filename] = JSON.parse(content);
    });
    writeFile(targetPath, contentGenerator(obj), "utf8");
    console.log(`Written entity category map to "${assetPath}" to "${targetPath}"`);
}

const { distRuntimeDataDir } = BUILD_CONFIG;

// Create symlink from src/js/runtime_data to dist/js/runtime_data
const symlinkSource = path.resolve(__dirname, "dist/js/runtime_data");
const symlinkTarget = path.resolve(__dirname, "src/js/runtime_data");
if (!fs.existsSync(symlinkTarget)) {
    const relativeSource = path.relative(path.dirname(symlinkTarget), symlinkSource);
    fs.symlinkSync(relativeSource, symlinkTarget, "dir");
    console.log(`Created symlink: ${symlinkTarget} -> ${relativeSource}`);
}

// JS Modules
// NOTE: Most entity runtime data generation has moved to EntityProcessor.writeRuntimeDataFiles()
// Only materials, properties, and workflows are still generated here

buildAsset({
    assetPath: `${BUILD_CONFIG.materials.assets.path}/${BUILD_CONFIG.materials.assets.categories}`,
    dataPath: BUILD_CONFIG.materials.data.path,
    targetPath: `${distRuntimeDataDir}/materials.json`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.properties.assets.path}/${BUILD_CONFIG.properties.assets.categories}`,
    dataPath: BUILD_CONFIG.properties.data.path,
    targetPath: `${distRuntimeDataDir}/properties.json`,
});

// Py Modules
// NOTE: Python runtime data generation for models, methods, and applications has moved to EntityProcessor.writeRuntimeDataFiles()
// Only materials, properties, and workflows are still generated here

buildAsset({
    assetPath: `${BUILD_CONFIG.materials.assets.path}/${BUILD_CONFIG.materials.assets.categories}`,
    dataPath: BUILD_CONFIG.materials.data.path,
    targetPath: "./src/py/mat3ra/standata/data/materials.py",
    contentGenerator: (content) =>
        `import json\n\nmaterials_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.properties.assets.path}/${BUILD_CONFIG.properties.assets.categories}`,
    dataPath: BUILD_CONFIG.properties.data.path,
    targetPath: "./src/py/mat3ra/standata/data/properties.py",
    contentGenerator: (content) =>
        `import json\n\nproperties_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
