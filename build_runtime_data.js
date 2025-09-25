/**
 * build_runtime_data uses node API to read all entity category files from the FS
 * at build time and writes them out to JSON files for
 * downstream consumption to avoid FS calls in the browser.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function buildAsset({
    assetPath,
    targetPath,
    contentGenerator = (content) => `${JSON.stringify(content)}\n`,
}) {
    const fileContent = fs.readFileSync(assetPath, { encoding: "utf-8" });
    const obj = {};
    obj.standataConfig = yaml.load(fileContent);

    obj.filesMapByName = {};

    // Check duplicate filenames for sanity
    const filenames = obj.standataConfig.entities.map((entity) => entity.filename);
    const duplicateFilenames = filenames.filter(
        (filename, index) => filenames.indexOf(filename) !== index,
    );
    if (duplicateFilenames.length > 0) {
        throw new Error(`Duplicate filenames found in ${assetPath}: ${duplicateFilenames}`);
    }
    // Create JSON
    obj.standataConfig.entities?.forEach((entity) => {
        const entityPath = path.join(path.dirname(assetPath), entity.filename);
        const content = fs.readFileSync(path.resolve(entityPath), { encoding: "utf-8" });
        console.log({ content, entityPath });
        obj.filesMapByName[entity.filename] = JSON.parse(content);
    });
    fs.writeFileSync(targetPath, contentGenerator(obj), "utf8");
    console.log(`Written entity category map to "${assetPath}" to "${targetPath}"`);
}

const runtimeDataDir = "./dist/js/runtime_data";
// JS Modules

buildAsset({
    assetPath: "./materials/categories.yml",
    targetPath: `${runtimeDataDir}/materials.json`,
});
buildAsset({
    assetPath: "./properties/categories.yml",
    targetPath: `${runtimeDataDir}/properties.json`,
});
buildAsset({
    assetPath: "./applications/applications/categories.yml",
    targetPath: `${runtimeDataDir}/applications.json`,
});
buildAsset({
    assetPath: "./workflows/workflows/categories.yml",
    targetPath: `${runtimeDataDir}/workflows.json`,
});
buildAsset({
    assetPath: "./workflows/subworkflows/categories.yml",
    targetPath: `${runtimeDataDir}/subworkflows.json`,
});

function copyJsonAsset({ sourcePath, targetPath, buildCommand }) {
    if (fs.existsSync(sourcePath)) {
        const content = fs.readFileSync(sourcePath, "utf8");
        fs.writeFileSync(targetPath, content, "utf8");
        console.log(`Copied ${path.basename(sourcePath)} to "${targetPath}"`);
    } else {
        console.warn(`Warning: ${sourcePath} not found. Run '${buildCommand}' first.`);
    }
}

// Copy JSON assets to runtime_data
copyJsonAsset({
    sourcePath: "./workflows/workflowSubforkflowMapByApplication.json",
    targetPath: `${runtimeDataDir}/workflowSubforkflowMapByApplication.json`,
    buildCommand: "npm run build:workflows",
});

copyJsonAsset({
    sourcePath: "./applications/modelMethodMapByApplication.json",
    targetPath: `${runtimeDataDir}/modelMethodMapByApplication.json`,
    buildCommand: "npm run build:applications",
});

copyJsonAsset({
    sourcePath: "./applications/applicationTreeByApplication.json",
    targetPath: `${runtimeDataDir}/applicationTreeByApplication.json`,
    buildCommand: "npm run build:templates",
});

copyJsonAsset({
    sourcePath: "./applications/templatesByApplication.json",
    targetPath: `${runtimeDataDir}/templatesByApplication.json`,
    buildCommand: "npm run build:templates",
});

// Py Modules

buildAsset({
    assetPath: "./materials/categories.yml",
    targetPath: "./src/py/mat3ra/standata/data/materials.py",
    contentGenerator: (content) =>
        `import json\n\nmaterials_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: "./properties/categories.yml",
    targetPath: "./src/py/mat3ra/standata/data/properties.py",
    contentGenerator: (content) =>
        `import json\n\nproperties_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: "./applications/applications/categories.yml",
    targetPath: "./src/py/mat3ra/standata/data/applications.py",
    contentGenerator: (content) =>
        `import json\n\napplications_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: "./workflows/workflows/categories.yml",
    targetPath: "./src/py/mat3ra/standata/data/workflows.py",
    contentGenerator: (content) =>
        `import json\n\nworkflows_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: "./workflows/subworkflows/categories.yml",
    targetPath: "./src/py/mat3ra/standata/data/subworkflows.py",
    contentGenerator: (content) =>
        `import json\n\nsubworkflows_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
