const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const applicationDataPath = path.resolve(
    __dirname,
    "..",
    "..",
    "applications",
    "application_flavors",
    "application_data.yaml",
);
const applicationData = yaml.load(fs.readFileSync(applicationDataPath, "utf8"));
const allApplications = applicationData.applications || [];

console.log("Applications found:", allApplications);

const allWorkflows = { workflows: {}, subworkflows: {} };

const loadFile = (name, dir, file, type) => {
    const entryPath = path.resolve(dir, file);
    if (!fs.statSync(entryPath).isFile()) {
        console.log(`Skipping ${entryPath} as it is not a file.`);
        return;
    }
    const obj = fs.readFileSync(path.resolve(dir, file), "utf8");
    const key = file.split(".")[0];
    allWorkflows[type][name][key] = yaml.load(obj);
};

allApplications.forEach((name) => {
    allWorkflows.workflows[name] = {};
    allWorkflows.subworkflows[name] = {};
    const wfDir = path.resolve(__dirname, "assets", "workflows", name);
    const swDir = path.resolve(__dirname, "assets", "subworkflows", name);

    if (fs.existsSync(wfDir)) {
        const wfFiles = fs.readdirSync(wfDir);
        console.log(`Building ${name}: ${wfFiles.length} workflow(s)`);
        wfFiles.forEach((file) => loadFile(name, wfDir, file, "workflows"));
    } else {
        console.log(`Workflow directory not found for ${name}: ${wfDir}`);
    }

    if (fs.existsSync(swDir)) {
        const swFiles = fs.readdirSync(swDir);
        console.log(`Building ${name}: ${swFiles.length} subworkflow(s)`);
        swFiles.forEach((file) => loadFile(name, swDir, file, "subworkflows"));
    } else {
        console.log(`Subworkflow directory not found for ${name}: ${swDir}`);
    }
});

const workflowDataOutput = {
    workflowData: allWorkflows,
};

const outputPath = path.resolve(__dirname, "workflows_data.json");
fs.writeFileSync(outputPath, JSON.stringify(workflowDataOutput, null, 2), "utf8");
console.log(`Workflow data written to: ${outputPath}`);
