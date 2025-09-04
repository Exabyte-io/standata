const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const WORKFLOWS_DIR = path.resolve(__dirname, "..", "..");
const CATEGORIES_FILENAME = "categories.yml";
const CATEGORIES_FILEPATH = path.resolve(WORKFLOWS_DIR, CATEGORIES_FILENAME);

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

function extractPropertyName(item) {
    if (typeof item === "string") return item;
    if (item && typeof item === "object" && typeof item.name === "string") return item.name;
    return null;
}

function extractApplicationFromSubworkflows(subworkflows) {
    const applications = new Set();
    subworkflows.forEach((subworkflow) => {
        if (subworkflow.application?.name) {
            applications.add(subworkflow.application.name);
        }
    });
    return Array.from(applications);
}

function hasMultiMaterialSubworkflow(subworkflows) {
    return subworkflows.some((subworkflow) => subworkflow.isMultiMaterial);
}

function extractPropertiesFromWorkflow(workflow) {
    if (!workflow.properties || !Array.isArray(workflow.properties)) {
        return [];
    }

    return workflow.properties.map(extractPropertyName).filter(Boolean);
}

function buildWorkflowCategories(workflow) {
    const categories = [];

    if (workflow.subworkflows?.length > 0) {
        const applications = extractApplicationFromSubworkflows(workflow.subworkflows);
        categories.push(...applications);
    }

    const properties = extractPropertiesFromWorkflow(workflow);
    categories.push(...properties);

    const materialCount = hasMultiMaterialSubworkflow(workflow.subworkflows || [])
        ? "multi-material"
        : "single-material";
    categories.push(materialCount);

    return [...new Set(categories.filter((c) => typeof c === "string"))];
}

function updateGlobalCategories(workflow, categories) {
    if (workflow.subworkflows?.length > 0) {
        workflow.subworkflows.forEach((subworkflow) => {
            if (subworkflow.application?.name) {
                workflowData.standataConfig.categories.application.add(
                    subworkflow.application.name,
                );
            }
        });
    }

    const properties = extractPropertiesFromWorkflow(workflow);
    properties.forEach((prop) => {
        workflowData.standataConfig.categories.property.add(prop);
    });
}

function processWorkflowFile(filename) {
    try {
        const filePath = path.resolve(WORKFLOWS_DIR, filename);
        const workflowContent = fs.readFileSync(filePath, "utf8");
        const workflow = JSON.parse(workflowContent);

        const categories = buildWorkflowCategories(workflow);
        updateGlobalCategories(workflow, categories);

        workflowData.standataConfig.entities.push({
            filename,
            categories,
        });

        workflowData.filesMapByName[filename] = workflow;
    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
    }
}

function writeCategoriesFile() {
    const sortedCategories = {
        ...workflowData.standataConfig,
        categories: {
            ...workflowData.standataConfig.categories,
            application: Array.from(workflowData.standataConfig.categories.application).sort(),
            property: Array.from(workflowData.standataConfig.categories.property).sort(),
        },
    };

    const categoriesYml = yaml.dump(sortedCategories);
    fs.writeFileSync(
        CATEGORIES_FILEPATH,
        categoriesYml + (categoriesYml.endsWith("\n") ? "" : "\n"),
        "utf8",
    );
}

if (fs.existsSync(WORKFLOWS_DIR)) {
    const workflowFiles = fs.readdirSync(WORKFLOWS_DIR).filter((file) => file.endsWith(".json"));
    workflowFiles.forEach(processWorkflowFile);
    writeCategoriesFile();
}
