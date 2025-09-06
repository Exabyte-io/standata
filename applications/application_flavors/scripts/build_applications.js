const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const utils = require("@mat3ra/code/dist/js/utils");
const { getApplicationNamesFromSources } = require("../../scripts/applications");

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
const allowedApplications = new Set(getApplicationNamesFromSources());
const applicationsDir = path.resolve(applicationFlavorsPath, "applications");
if (fs.existsSync(applicationsDir)) {
    const appFiles = fs
        .readdirSync(applicationsDir)
        .filter((file) => file.endsWith(".yml") || file.endsWith(".yaml"));
    const filtered = appFiles.filter((file) =>
        allowedApplications.has(file.replace(/\.(yml|yaml)$/, "")),
    );
    console.log(`Creating individual JSON files for ${filtered.length} applications`);

    filtered.forEach((file) => {
        const appName = file.replace(/\.(yml|yaml)$/, "");
        const appData = loadYamlFile(path.resolve(applicationsDir, file));
        if (appData) {
            const jsonContent = {
                name: appData.name,
                shortName: appData.shortName,
                summary: appData.summary,
                defaultVersion: appData.defaultVersion,
                isLicensed: appData.isLicensed || false,
                versions: appData.versions || [],
            };

            const jsonFilePath = path.resolve(outputDir, `${appName}.json`);
            fs.writeFileSync(jsonFilePath, JSON.stringify(jsonContent, null, 2), "utf8");
            console.log(`Created ${jsonFilePath}`);
        }
    });
}
