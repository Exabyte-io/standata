const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

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

function extractPropertiesFromSubworkflow(subworkflow) {
    const props = new Set(Array.isArray(subworkflow.properties) ? subworkflow.properties.map(toPropName).filter(Boolean) : []);
    if (Array.isArray(subworkflow.units)) {
        subworkflow.units.forEach((unit) => {
            if (Array.isArray(unit.results)) unit.results.map(toPropName).filter(Boolean).forEach((p) => props.add(p));
            if (unit.executable && Array.isArray(unit.executable.results)) {
                unit.executable.results.map(toPropName).filter(Boolean).forEach((p) => props.add(p));
            }
        });
    }
    return Array.from(props);
}

// Read existing workflow JSON files to extract categories
const workflowsDir = path.resolve(__dirname, "..", "..");
if (fs.existsSync(workflowsDir)) {
    const workflowFiles = fs.readdirSync(workflowsDir).filter((file) => file.endsWith(".json"));

    workflowFiles.forEach((filename) => {
        try {
            const filePath = path.resolve(workflowsDir, filename);
            const workflowContent = fs.readFileSync(filePath, "utf8");
            const workflow = JSON.parse(workflowContent);

            // Extract application and properties from subworkflows
            if (workflow.subworkflows && workflow.subworkflows.length > 0) {
                workflow.subworkflows.forEach((subworkflow) => {
                    if (subworkflow.application && subworkflow.application.name) {
                        workflowData.standataConfig.categories.application.add(
                            subworkflow.application.name,
                        );
                    }
                    extractPropertiesFromSubworkflow(subworkflow).forEach((prop) => {
                        workflowData.standataConfig.categories.property.add(prop);
                    });
                });
            }

            // Also check top-level properties
            if (workflow.properties && Array.isArray(workflow.properties)) {
                workflow.properties.map(toPropName).filter(Boolean).forEach((prop) => {
                    workflowData.standataConfig.categories.property.add(prop);
                });
            }

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

// Generate entities from existing JSON files
Object.keys(workflowData.filesMapByName).forEach((filename) => {
    const workflow = workflowData.filesMapByName[filename];
    const categories = [];

    // Add application categories
    if (workflow.subworkflows && workflow.subworkflows.length > 0) {
        workflow.subworkflows.forEach((subworkflow) => {
            if (subworkflow.application && subworkflow.application.name) {
                categories.push(subworkflow.application.name);
            }
        });
    }

    // Add property categories (from explicit properties or inferred from units)
    if (workflow.subworkflows && workflow.subworkflows.length > 0) {
        workflow.subworkflows.forEach((subworkflow) => {
            extractPropertiesFromSubworkflow(subworkflow).forEach((prop) => {
                if (workflowData.standataConfig.categories.property.includes(prop)) {
                    categories.push(prop);
                }
            });
        });
    }

    // Also check top-level properties
    if (workflow.properties && Array.isArray(workflow.properties)) {
        workflow.properties.map(toPropName).filter(Boolean).forEach((prop) => {
            if (workflowData.standataConfig.categories.property.includes(prop)) {
                categories.push(prop);
            }
        });
    }

    // Add material count (default to single-material, can be enhanced later)
    categories.push("single-material");

    // Remove duplicates and ensure primitives only
    const uniqueCategories = [...new Set(categories.filter((c) => typeof c === "string"))];

    workflowData.standataConfig.entities.push({
        filename,
        categories: uniqueCategories,
    });
});

// Write the categories.yml file for workflows
const categoriesYml = yaml.dump(workflowData.standataConfig);
fs.writeFileSync(
    path.resolve(workflowsDir, "categories.yml"),
    categoriesYml + (categoriesYml.endsWith("\n") ? "" : "\n"),
    "utf8",
);
