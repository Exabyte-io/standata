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

const outputDir = path.resolve(__dirname, "..");

const loadYamlFile = (filePath) => {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content, { schema: utils.JsYamlAllSchemas });
};

// Load applications data and create individual JSON files
const applicationsDir = path.resolve(applicationFlavorsPath, "applications");
if (fs.existsSync(applicationsDir)) {
    const appFiles = fs.readdirSync(applicationsDir);
    console.log(`Creating individual JSON files for ${appFiles.length} applications`);
    
    appFiles.forEach((file) => {
        if (file.endsWith('.yml') || file.endsWith('.yaml')) {
            const appName = file.replace(/\.(yml|yaml)$/, '');
            if (appName === 'application_data') return; // Skip the main data file
            
            const appData = loadYamlFile(path.resolve(applicationsDir, file));
            if (appData) {
                // Create the JSON file content
                const jsonContent = {
                    name: appData.name,
                    shortName: appData.shortName,
                    summary: appData.summary,
                    defaultVersion: appData.defaultVersion,
                    isLicensed: appData.isLicensed || false,
                    versions: appData.versions || []
                };
                
                // Write to individual JSON file
                const jsonFilePath = path.resolve(outputDir, `${appName}.json`);
                fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2), "utf8");
                console.log(`Created ${jsonFilePath}`);
            }
        }
    });
}