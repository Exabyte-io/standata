const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const {
    getApplicationNamesFromSources,
} = require("../../../applications/application_flavors/scripts/get_applications");

const applications = getApplicationNamesFromSources();
console.log("Applications found:", applications);

const allWorkflows = { workflows: {}, subworkflows: {} };

function loadYamlIntoCollection(applicationName, directoryPath, filename, collectionKey) {
    const entryPath = path.resolve(directoryPath, filename);
    if (!fs.existsSync(entryPath) || !fs.statSync(entryPath).isFile()) return;
    if (!/\.(yml|yaml)$/i.test(filename)) return;
    const content = fs.readFileSync(entryPath, "utf8");
    const key = filename.replace(/\.(yml|yaml)$/i, "");
    allWorkflows[collectionKey][applicationName][key] = yaml.load(content);
}

applications.forEach((name) => {
    allWorkflows.workflows[name] = {};
    allWorkflows.subworkflows[name] = {};

    const sourcesRoot = path.resolve(process.cwd(), "workflows", "sources");
    const wfDir = path.resolve(sourcesRoot, "workflows", name);
    const swDir = path.resolve(sourcesRoot, "subworkflows", name);

    if (fs.existsSync(wfDir)) {
        const wfFiles = fs.readdirSync(wfDir);
        console.log(`Building ${name}: ${wfFiles.length} workflow(s)`);
        wfFiles.forEach((file) => loadYamlIntoCollection(name, wfDir, file, "workflows"));
    } else {
        console.log(`Workflow directory not found for ${name}: ${wfDir}`);
    }

    if (fs.existsSync(swDir)) {
        const swFiles = fs.readdirSync(swDir);
        console.log(`Building ${name}: ${swFiles.length} subworkflow(s)`);
        swFiles.forEach((file) => loadYamlIntoCollection(name, swDir, file, "subworkflows"));
    } else {
        console.log(`Subworkflow directory not found for ${name}: ${swDir}`);
    }
});

const workflowDataOutput = { workflowData: allWorkflows };
const outputPath = path.resolve(__dirname, "..", "generated", "workflows_data.json");
fs.writeFileSync(outputPath, JSON.stringify(workflowDataOutput, null, 2), "utf8");
console.log(`Workflow data written to: ${outputPath}`);
