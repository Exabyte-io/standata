const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { createWorkflowConfigs, createSubworkflowByName } = require("@exabyte-io/wode.js");

const applications = ["espresso"];
const BASE_PATH = "..";

const workflowSubforkflowMapByApplication = { workflows: {}, subworkflows: {} };

// Helper functions
function loadYamlIntoCollection(applicationName, directoryPath, filename, collectionKey) {
    const entryPath = path.resolve(directoryPath, filename);
    if (!fs.existsSync(entryPath) || !fs.statSync(entryPath).isFile()) return;
    if (!/\.(yml|yaml)$/i.test(filename)) return;
    const content = fs.readFileSync(entryPath, "utf8");
    const key = filename.replace(/\.(yml|yaml)$/i, "");
    workflowSubforkflowMapByApplication[collectionKey][applicationName][key] = yaml.load(content);
}

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
    workflowSubforkflowMapByApplication.workflows[name] = {};
    workflowSubforkflowMapByApplication.subworkflows[name] = {};

    const sourcesRoot = path.resolve(process.cwd(), "workflows", "sources");
    const wfDir = path.resolve(sourcesRoot, "workflows", name);
    const swDir = path.resolve(sourcesRoot, "subworkflows", name);

    const wfFiles = fs.readdirSync(wfDir);
    console.log(`Building ${name}: ${wfFiles.length} workflow(s)`);
    wfFiles.forEach((file) => loadYamlIntoCollection(name, wfDir, file, "workflows"));

    const swFiles = fs.readdirSync(swDir);
    console.log(`Building ${name}: ${swFiles.length} subworkflow(s)`);
    swFiles.forEach((file) => loadYamlIntoCollection(name, swDir, file, "subworkflows"));
});

// Save the workflow and subworkflow map for usage in Wode or elsewhere
const assetPath = path.resolve(__dirname, BASE_PATH, "workflowSubforkflowMapByApplication.json");
fs.writeFileSync(assetPath, JSON.stringify(workflowSubforkflowMapByApplication, null, 2), "utf8");

// Generate workflows
const workflowConfigs = createWorkflowConfigs(applications, workflowSubforkflowMapByApplication);
const workflowItems = workflowConfigs.map((config) => ({
    appName: config.application,
    name: config.name.toLowerCase().replace(/[^a-z0-9]/g, "_"),
    config: config.config,
}));

generateConfigFiles(workflowItems, "workflow");

// Generate subworkflows
const subworkflowItems = [];
applications.forEach((appName) => {
    const subworkflows = workflowSubforkflowMapByApplication.subworkflows[appName];
    if (!subworkflows) return;

    Object.keys(subworkflows).forEach((subworkflowName) => {
        const subworkflow = createSubworkflowByName({
            appName,
            swfName: subworkflowName,
            workflowsData: workflowSubforkflowMapByApplication,
        });

        subworkflowItems.push({
            appName,
            name: subworkflowName,
            config: subworkflow.toJSON(),
        });
    });
});

generateConfigFiles(subworkflowItems, "subworkflow");
