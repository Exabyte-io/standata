/**
 * build_runtime_data uses node API to read all entity category files from the FS
 * at build time and writes them out to JSON files for
 * downstream consumption to avoid FS calls in the browser.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const BUILD_CONFIG = require("./build-config");

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
        console.log({ content, entityPath });
        obj.filesMapByName[entity.filename] = JSON.parse(content);
    });
    writeFile(targetPath, contentGenerator(obj), "utf8");
    console.log(`Written entity category map to "${assetPath}" to "${targetPath}"`);
}

const { runtimeDataDir } = BUILD_CONFIG;

// Create symlink from src/js/runtime_data to dist/js/runtime_data
const symlinkSource = path.resolve(__dirname, "dist/js/runtime_data");
const symlinkTarget = path.resolve(__dirname, "src/js/runtime_data");
if (!fs.existsSync(symlinkTarget)) {
    const relativeSource = path.relative(path.dirname(symlinkTarget), symlinkSource);
    fs.symlinkSync(relativeSource, symlinkTarget, "dir");
    console.log(`Created symlink: ${symlinkTarget} -> ${relativeSource}`);
}

// JS Modules

buildAsset({
    assetPath: `${BUILD_CONFIG.materials.assets.path}/${BUILD_CONFIG.materials.assets.categories}`,
    dataPath: BUILD_CONFIG.materials.data.path,
    targetPath: `${runtimeDataDir}/materials.json`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.properties.assets.path}/${BUILD_CONFIG.properties.assets.categories}`,
    dataPath: BUILD_CONFIG.properties.data.path,
    targetPath: `${runtimeDataDir}/properties.json`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.applications.assets.path}/${BUILD_CONFIG.applications.assets.categories}`,
    dataPath: BUILD_CONFIG.applications.data.path,
    targetPath: `${runtimeDataDir}/applications.json`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.models.assets.path}/${BUILD_CONFIG.models.assets.categories}`,
    dataPath: BUILD_CONFIG.models.data.path,
    targetPath: `${runtimeDataDir}/models.json`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.methods.assets.path}/${BUILD_CONFIG.methods.assets.categories}`,
    dataPath: BUILD_CONFIG.methods.data.path,
    targetPath: `${runtimeDataDir}/methods.json`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.workflows.assets.path}/${BUILD_CONFIG.workflows.assets.workflowsCategories}`,
    dataPath: `${BUILD_CONFIG.workflows.data.path}/${BUILD_CONFIG.workflows.data.workflows}`,
    targetPath: `${runtimeDataDir}/workflows.json`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.workflows.assets.path}/${BUILD_CONFIG.workflows.assets.subworkflowsCategories}`,
    dataPath: `${BUILD_CONFIG.workflows.data.path}/${BUILD_CONFIG.workflows.data.subworkflows}`,
    targetPath: `${runtimeDataDir}/subworkflows.json`,
});

function copyJSONAsset({ sourcePath, targetPath }) {
    if (fs.existsSync(sourcePath)) {
        const content = fs.readFileSync(sourcePath, "utf8");
        writeFile(targetPath, content, "utf8");
        console.log(`Copied ${path.basename(sourcePath)} to "${targetPath}"`);
    } else {
        console.warn(`Warning: ${sourcePath} not found.`);
    }
}

// eslint-disable-next-line no-unused-vars,@typescript-eslint/no-unused-vars
function linkJSONAsset({ sourcePath, targetPath }) {
    if (fs.existsSync(sourcePath)) {
        const resolvedSourcePath = path.resolve(__dirname, sourcePath);
        const resolvedTargetPath = path.resolve(__dirname, targetPath);
        fs.rmSync(resolvedTargetPath, { force: true });
        fs.symlinkSync(resolvedSourcePath, resolvedTargetPath, "file");
        console.log(`Copied ${path.basename(sourcePath)} to "${targetPath}"`);
    } else {
        console.warn(`Warning: ${sourcePath} not found.`);
    }
}

// Py Modules

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
buildAsset({
    assetPath: `${BUILD_CONFIG.applications.assets.path}/${BUILD_CONFIG.applications.assets.categories}`,
    dataPath: BUILD_CONFIG.applications.data.path,
    targetPath: "./src/py/mat3ra/standata/data/applications.py",
    contentGenerator: (content) =>
        `import json\n\napplications_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.models.assets.path}/${BUILD_CONFIG.models.assets.categories}`,
    dataPath: BUILD_CONFIG.models.data.path,
    targetPath: "./src/py/mat3ra/standata/data/models.py",
    contentGenerator: (content) =>
        `import json\n\nmodels_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.methods.assets.path}/${BUILD_CONFIG.methods.assets.categories}`,
    dataPath: BUILD_CONFIG.methods.data.path,
    targetPath: "./src/py/mat3ra/standata/data/methods.py",
    contentGenerator: (content) =>
        `import json\n\nmethods_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.workflows.assets.path}/${BUILD_CONFIG.workflows.assets.workflowsCategories}`,
    dataPath: `${BUILD_CONFIG.workflows.data.path}/${BUILD_CONFIG.workflows.data.workflows}`,
    targetPath: "./src/py/mat3ra/standata/data/workflows.py",
    contentGenerator: (content) =>
        `import json\n\nworkflows_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
buildAsset({
    assetPath: `${BUILD_CONFIG.workflows.assets.path}/${BUILD_CONFIG.workflows.assets.subworkflowsCategories}`,
    dataPath: `${BUILD_CONFIG.workflows.data.path}/${BUILD_CONFIG.workflows.data.subworkflows}`,
    targetPath: "./src/py/mat3ra/standata/data/subworkflows.py",
    contentGenerator: (content) =>
        `import json\n\nsubworkflows_data = json.loads(r'''${JSON.stringify(content)}''')\n`,
});
