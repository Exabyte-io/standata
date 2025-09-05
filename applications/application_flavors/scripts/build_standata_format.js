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

const loadYamlFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content, { schema: utils.JsYamlAllSchemas });
};

// Define categories for application flavors
const categories = {
    application_type: ["quantum_chemistry", "molecular_dynamics", "machine_learning", "scripting", "visualization"],
    computational_method: ["dft", "classical_md", "neural_network", "shell_scripting"],
    license_type: ["open_source", "commercial", "academic"]
};

// Map applications to categories
const applicationCategories = {
    deepmd: ["machine_learning", "neural_network", "open_source"],
    espresso: ["quantum_chemistry", "dft", "open_source"],
    jupyterLab: ["visualization", "scripting", "open_source"],
    nwchem: ["quantum_chemistry", "dft", "open_source"],
    python: ["scripting", "open_source"],
    shell: ["scripting", "shell_scripting", "open_source"],
    vasp: ["quantum_chemistry", "dft", "commercial"]
};

const standataConfig = {
    categories: categories,
    entities: []
};

const filesMapByName = {};

// Load applications data
const applicationsDir = path.resolve(applicationFlavorsPath, "applications");
if (fs.existsSync(applicationsDir)) {
    const appFiles = fs.readdirSync(applicationsDir);
    console.log(`Processing ${appFiles.length} application files`);
    
    appFiles.forEach((file) => {
        if (file.endsWith('.yml') || file.endsWith('.yaml')) {
            const appName = file.replace(/\.(yml|yaml)$/, '');
            if (appName === 'application_data') return; // Skip the main data file
            
            const appData = loadYamlFile(path.resolve(applicationsDir, file));
            if (appData) {
                // Create filename for this application
                const filename = `${appName}.json`;
                
                // Add to entities with categories
                const appCategories = applicationCategories[appName] || ["open_source"];
                standataConfig.entities.push({
                    filename: filename,
                    categories: appCategories
                });
                
                // Add to filesMapByName
                filesMapByName[filename] = {
                    name: appData.name,
                    shortName: appData.shortName,
                    summary: appData.summary,
                    defaultVersion: appData.defaultVersion,
                    isLicensed: appData.isLicensed || false,
                    versions: appData.versions || []
                };
                
                console.log(`Processed ${appName}: ${appData.name}`);
            }
        }
    });
}

const standataFormat = {
    standataConfig: standataConfig,
    filesMapByName: filesMapByName
};

// Generate the Python data file
const pythonDataContent = `import json

application_flavors_data = json.loads(r'''${JSON.stringify(standataFormat)}''')`;

const pythonOutputPath = path.resolve(__dirname, "..", "..", "..", "src", "py", "mat3ra", "standata", "data", "application_flavors.py");
fs.writeFileSync(pythonOutputPath, pythonDataContent, "utf8");
console.log(`Python data file written to: ${pythonOutputPath}`);

// Also generate JSON for reference
const jsonOutputPath = path.resolve(__dirname, "..", "generated", "standata_format.json");
const outputDir = path.dirname(jsonOutputPath);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(jsonOutputPath, JSON.stringify(standataFormat, null, 2), "utf8");
console.log(`JSON reference written to: ${jsonOutputPath}`);
