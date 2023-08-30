/**
 * build_entity_map uses node API to read all entity category files from the FS
 * at build time and writes them out to a single JSON file for
 * downstream consumption to avoid FS calls in the browser.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function buildAsset({ assetPath, targetPath }) {
    const fileContent = fs.readFileSync(assetPath, { encoding: "utf-8" });
    const obj = {};
    obj.standataConfig = yaml.load(fileContent);

    obj.filesMapByName = {};
    obj.standataConfig.entities?.forEach((entity) => {
        const entityPath = path.join(path.dirname(assetPath), entity.filename);
        const content = fs.readFileSync(path.resolve(entityPath), { encoding: "utf-8" });
        obj.filesMapByName[entity.filename] = JSON.parse(content);
    });

    fs.writeFileSync(targetPath, JSON.stringify(obj) + "\n", "utf8");
    console.log(`Written entity category map to "${assetPath}" to "${targetPath}"`);
}

buildAsset({
    assetPath: "./materials/categories.yml",
    targetPath: "./src/js/runtime_data/materials.json",
});

buildAsset({
    assetPath: "./properties/categories.yml",
    targetPath: "./src/js/runtime_data/properties.json",
});

buildAsset({
    assetPath: "./applications/categories.yml",
    targetPath: "./src/js/runtime_data/applications.json",
});

buildAsset({
    assetPath: "./workflows/categories.yml",
    targetPath: "./src/js/runtime_data/workflows.json",
});
