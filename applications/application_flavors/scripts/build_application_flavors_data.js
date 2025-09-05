const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const utils = require("@mat3ra/code/dist/js/utils");

const applicationFlavorsPath = path.resolve(
    __dirname,
    "..",
    "..",
    "..",
    "..",
    "stack",
    "lib",
    "application-flavors",
);

const allApplicationFlavors = {
    applications: {},
    templates: {},
    executables: {},
    methods: {},
    models: {},
};

const loadYamlFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content, { schema: utils.JsYamlAllSchemas });
};

const loadJsonFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content);
};

// Load applications data
const applicationsDir = path.resolve(applicationFlavorsPath, "applications");
if (fs.existsSync(applicationsDir)) {
    const appFiles = fs.readdirSync(applicationsDir);
    console.log(`Loading ${appFiles.length} application files`);
    
    appFiles.forEach((file) => {
        if (file.endsWith('.yml') || file.endsWith('.yaml')) {
            const appName = file.replace(/\.(yml|yaml)$/, '');
            const appData = loadYamlFile(path.resolve(applicationsDir, file));
            if (appData) {
                allApplicationFlavors.applications[appName] = appData;
            }
        }
    });
}

// Load templates data
const templatesPath = path.resolve(applicationFlavorsPath, "templates", "templates.yml");
const templatesData = loadYamlFile(templatesPath);
if (templatesData) {
    allApplicationFlavors.templates = templatesData;
}

// Load executables data
const executablesDir = path.resolve(applicationFlavorsPath, "executables");
if (fs.existsSync(executablesDir)) {
    const loadExecutablesRecursively = (dir, prefix = '') => {
        const items = fs.readdirSync(dir);
        items.forEach((item) => {
            const itemPath = path.resolve(dir, item);
            const stat = fs.statSync(itemPath);
            
            if (stat.isDirectory()) {
                loadExecutablesRecursively(itemPath, prefix ? `${prefix}.${item}` : item);
            } else if (item.endsWith('.yml') || item.endsWith('.yaml')) {
                const key = prefix ? `${prefix}.${item.replace(/\.(yml|yaml)$/, '')}` : item.replace(/\.(yml|yaml)$/, '');
                const data = loadYamlFile(itemPath);
                if (data) {
                    allApplicationFlavors.executables[key] = data;
                }
            }
        });
    };
    
    loadExecutablesRecursively(executablesDir);
}

// Load methods data
const methodsDir = path.resolve(applicationFlavorsPath, "methods");
if (fs.existsSync(methodsDir)) {
    const methodApps = fs.readdirSync(methodsDir);
    methodApps.forEach((app) => {
        const appDir = path.resolve(methodsDir, app);
        if (fs.statSync(appDir).isDirectory()) {
            allApplicationFlavors.methods[app] = {};
            const methodFiles = fs.readdirSync(appDir);
            methodFiles.forEach((file) => {
                if (file.endsWith('.yml') || file.endsWith('.yaml')) {
                    const version = file.replace(/\.(yml|yaml)$/, '');
                    const methodData = loadYamlFile(path.resolve(appDir, file));
                    if (methodData) {
                        allApplicationFlavors.methods[app][version] = methodData;
                    }
                }
            });
        }
    });
}

// Load models data
const modelsDir = path.resolve(applicationFlavorsPath, "models");
if (fs.existsSync(modelsDir)) {
    const modelApps = fs.readdirSync(modelsDir);
    modelApps.forEach((app) => {
        const appDir = path.resolve(modelsDir, app);
        if (fs.statSync(appDir).isDirectory()) {
            allApplicationFlavors.models[app] = {};
            const modelFiles = fs.readdirSync(appDir);
            modelFiles.forEach((file) => {
                if (file.endsWith('.yml') || file.endsWith('.yaml')) {
                    const version = file.replace(/\.(yml|yaml)$/, '');
                    const modelData = loadYamlFile(path.resolve(appDir, file));
                    if (modelData) {
                        allApplicationFlavors.models[app][version] = modelData;
                    }
                }
            });
        }
    });
}

const applicationFlavorsOutput = {
    applicationFlavorsData: allApplicationFlavors,
};

const outputPath = path.resolve(__dirname, "..", "generated", "application_flavors_data.json");
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(applicationFlavorsOutput, null, 2), "utf8");
console.log(`Application flavors data written to: ${outputPath}`);
