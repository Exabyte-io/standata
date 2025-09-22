const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const applications = ["espresso"];
const BASE_PATH = "..";

const applicationDataByApplication = { applications: {}, methods: {}, models: {} };

// Helper functions
function loadYamlIntoCollection(applicationName, directoryPath, filename, collectionKey) {
    const entryPath = path.resolve(directoryPath, filename);
    if (!fs.existsSync(entryPath) || !fs.statSync(entryPath).isFile()) return;
    if (!/\.(yml|yaml)$/i.test(filename)) return;
    const content = fs.readFileSync(entryPath, "utf8");
    const key = filename.replace(/\.(yml|yaml)$/i, "");
    applicationDataByApplication[collectionKey][applicationName][key] = yaml.load(content);
}

/**
 * Generates configuration JSON files for applications, methods, or models.
 *
 * @param {Array} items - Array of objects containing appName, name, and config properties
 * @param {string} type - Type of configuration files to generate ("application", "method", or "model")
 *
 * Each item in the items array should have:
 * - appName: The application name (used for directory structure)
 * - name: The configuration name (used for filename)
 * - config: The configuration object to be written as JSON
 */
function generateConfigFiles(items, type) {
    const outputBaseDir = path.resolve(__dirname, BASE_PATH, `${type}s`);

    items.forEach((item) => {
        const { appName } = item;
        const { name } = item;
        const { config } = item;

        const appDir = path.resolve(outputBaseDir, appName);
        if (!fs.existsSync(appDir)) {
            fs.mkdirSync(appDir, { recursive: true });
        }
        const filename = `${name}.json`;
        const filePath = path.resolve(appDir, filename);

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
        console.log(`Generated ${type}: ${appName}/${filename}`);
    });
}

// Main script logic
applications.forEach((name) => {
    applicationDataByApplication.applications[name] = {};
    applicationDataByApplication.methods[name] = {};
    applicationDataByApplication.models[name] = {};

    const sourcesRoot = path.resolve(__dirname, BASE_PATH, "sources");
    const appDir = path.resolve(sourcesRoot, "applications");
    const methodDir = path.resolve(sourcesRoot, "methods", name);
    const modelDir = path.resolve(sourcesRoot, "models", name);

    // Load applications
    if (fs.existsSync(appDir)) {
        const appFiles = fs.readdirSync(appDir);
        console.log(`Building ${name}: ${appFiles.length} application file(s)`);
        appFiles.forEach((file) => loadYamlIntoCollection(name, appDir, file, "applications"));
    }

    // Load methods
    if (fs.existsSync(methodDir)) {
        const methodFiles = fs.readdirSync(methodDir);
        console.log(`Building ${name}: ${methodFiles.length} method file(s)`);
        methodFiles.forEach((file) => loadYamlIntoCollection(name, methodDir, file, "methods"));
    }

    // Load models
    if (fs.existsSync(modelDir)) {
        const modelFiles = fs.readdirSync(modelDir);
        console.log(`Building ${name}: ${modelFiles.length} model file(s)`);
        modelFiles.forEach((file) => loadYamlIntoCollection(name, modelDir, file, "models"));
    }
});

// Save the application data map for usage elsewhere
const assetPath = path.resolve(__dirname, BASE_PATH, "applicationDataByApplication.json");
fs.writeFileSync(assetPath, JSON.stringify(applicationDataByApplication, null, 2), "utf8");

// Generate application configuration files
const applicationItems = [];
applications.forEach((appName) => {
    const apps = applicationDataByApplication.applications[appName];
    if (!apps) return;

    Object.keys(apps).forEach((applicationName) => {
        const config = apps[applicationName];
        applicationItems.push({
            appName,
            name: applicationName,
            config,
        });
    });
});

generateConfigFiles(applicationItems, "application");

// Generate method configuration files
const methodItems = [];
applications.forEach((appName) => {
    const methods = applicationDataByApplication.methods[appName];
    if (!methods) return;

    Object.keys(methods).forEach((methodName) => {
        const config = methods[methodName];
        methodItems.push({
            appName,
            name: methodName,
            config,
        });
    });
});

generateConfigFiles(methodItems, "method");

// Generate model configuration files
const modelItems = [];
applications.forEach((appName) => {
    const models = applicationDataByApplication.models[appName];
    if (!models) return;

    Object.keys(models).forEach((modelName) => {
        const config = models[modelName];
        modelItems.push({
            appName,
            name: modelName,
            config,
        });
    });
});

generateConfigFiles(modelItems, "model");
