const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const WORKFLOWS_DIR = path.resolve(__dirname, "..", "..");
const CATEGORIES_FILENAME = "categories.yml";
const CATEGORIES_FILEPATH = path.resolve(WORKFLOWS_DIR, CATEGORIES_FILENAME);

// This script reads the generated workflow JSON files and updates workflows/categories.yml

// Generate workflow data for standata
const workflowData = {
    standataConfig: {
        categories: {
            application: new Set(),
            property: new Set(),
            material_count: ["single-material", "multi-material"],
        },
        entities: [],
    },
    filesMapByName: {},
};

function toPropName(item) {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && typeof item.name === "string") return item.name;
    return null;
}

if (fs.existsSync(WORKFLOWS_DIR)) {
    const workflowFiles = fs.readdirSync(WORKFLOWS_DIR).filter((file) => file.endsWith(".json"));

    workflowFiles.forEach((filename) => {
        try {
            const filePath = path.resolve(WORKFLOWS_DIR, filename);
            const workflowContent = fs.readFileSync(filePath, "utf8");
            const workflow = JSON.parse(workflowContent);

            const categories = [];
            const workflowProperties = new Set();

            let isMultiMaterial = false;
            if (workflow.subworkflows && workflow.subworkflows.length > 0) {
                workflow.subworkflows.forEach((subworkflow) => {
                    if (subworkflow.application && subworkflow.application.name) {
                        workflowData.standataConfig.categories.application.add(
                            subworkflow.application.name,
                        );
                        categories.push(subworkflow.application.name);
                    }

                    if (subworkflow.isMultiMaterial) {
                        isMultiMaterial = true;
                    }
                });
            }

            // Extract properties from top-level properties array
            if (workflow.properties && Array.isArray(workflow.properties)) {
                workflow.properties
                    .map(toPropName)
                    .filter(Boolean)
                    .forEach((prop) => {
                        workflowData.standataConfig.categories.property.add(prop);
                        workflowProperties.add(prop);
                    });
            }

            // Add workflow properties to categories
            Array.from(workflowProperties).forEach((prop) => {
                categories.push(prop);
            });

            const materialCount = isMultiMaterial ? "multi-material" : "single-material";
            categories.push(materialCount);

            // Remove duplicates and ensure primitives only
            const uniqueCategories = [...new Set(categories.filter((c) => typeof c === "string"))];

            workflowData.standataConfig.entities.push({
                filename,
                categories: uniqueCategories,
            });

            // Add to filesMapByName
            workflowData.filesMapByName[filename] = workflow;
        } catch (error) {
            console.error(`Error processing ${filename}:`, error.message);
        }
    });
}

// Convert Sets to arrays for YAML serialization
workflowData.standataConfig.categories.application = Array.from(
    workflowData.standataConfig.categories.application,
).sort();
workflowData.standataConfig.categories.property = Array.from(
    workflowData.standataConfig.categories.property,
).sort();

// Write the categories.yml file for workflows
const categoriesYml = yaml.dump(workflowData.standataConfig);
fs.writeFileSync(
    CATEGORIES_FILEPATH,
    categoriesYml + (categoriesYml.endsWith("\n") ? "" : "\n"),
    "utf8",
);
