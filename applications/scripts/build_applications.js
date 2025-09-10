const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { getApplicationNamesFromSources } = require("./get_applications");

const SOURCES_DIR = path.resolve(__dirname, "..", "sources");
const OUTPUT_DIR = path.resolve(__dirname, "..");

function loadYamlFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return null;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return yaml.load(content);
}

function processApplicationFile(filename) {
    try {
        const filePath = path.resolve(SOURCES_DIR, filename);
        const appData = loadYamlFile(filePath);

        if (!appData) {
            console.log(`No data found in ${filename}`);
            return;
        }

        const appName = filename.replace(/\.(yml|yaml)$/, "");
        const jsonContent = {
            name: appData.name,
            shortName: appData.shortName,
            summary: appData.summary,
            version: appData.version,
            build: appData.build,
            hasAdvancedComputeOptions: appData.hasAdvancedComputeOptions || false,
            isLicensed: appData.isLicensed || false,
        };

        const jsonFilePath = path.resolve(OUTPUT_DIR, `${appName}.json`);
        fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2), "utf8");
        console.log(`Generated: ${path.basename(jsonFilePath)}`);
    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
    }
}

const allowedApplications = new Set(getApplicationNamesFromSources());
console.log(`Found ${allowedApplications.size} applications to process:`, Array.from(allowedApplications));

if (fs.existsSync(SOURCES_DIR)) {
    const yamlFiles = fs
        .readdirSync(SOURCES_DIR)
        .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"))
        .filter((file) => {
            const appName = file.replace(/\.(yml|yaml)$/, "");
            return allowedApplications.has(appName);
        });

    console.log(`Processing ${yamlFiles.length} application files`);
    yamlFiles.forEach(processApplicationFile);
} else {
    console.log(`Sources directory not found: ${SOURCES_DIR}`);
}
