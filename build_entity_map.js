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
    const obj = yaml.load(fileContent);

    obj.entities?.forEach((entity) => {
        const entityPath = path.join(path.dirname(assetPath), entity.filename);
        const content = fs.readFileSync(path.resolve(entityPath), { encoding: "utf-8" });
        obj[entity.filename] = JSON.parse(content);
    });

    fs.writeFileSync(targetPath, JSON.stringify(obj) + "\n", "utf8");
    console.log(`Written entity category map to "${assetPath}" to "${targetPath}"`);
}

buildAsset({
    assetPath: "./materials/categories.yml",
    targetPath: "./src/js/entities/materials.json",
});

buildAsset({
    assetPath: "./properties/categories.yml",
    targetPath: "./src/js/entities/properties.json",
});

buildAsset({
    assetPath: "./applications/categories.yml",
    targetPath: "./src/js/entities/applications.json",
});

buildAsset({
    assetPath: "./workflows/categories.yml",
    targetPath: "./src/js/entities/workflows.json",
});
