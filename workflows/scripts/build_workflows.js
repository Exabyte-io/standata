const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { v5: uuidv5 } = require("uuid");
const { createWorkflowConfigs } = require("@exabyte-io/wode.js");
const wodeWorkflowsStore = require("@exabyte-io/wode.js/dist/workflows/workflows");

const applications = ["espresso"];

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

const workflowData = allWorkflows;

// Inject workflowData into wode.js internal module
wodeWorkflowsStore.workflowData = workflowData;

const workflowConfigs = createWorkflowConfigs(null, workflowData);

const workflowsDir = path.resolve(__dirname, "..");

const WORKFLOW_NAMESPACE = "12345678-1234-4000-8000-000000000000";
const generateDeterministicUUID = (seed) => {
    return uuidv5(seed, WORKFLOW_NAMESPACE);
};

const returnConfigWithFixedIds = (config) => {
    const workflowSeed = `${config.name}_${
        config.subworkflows?.[0]?.application?.name || "unknown"
    }`;
    const baseId = generateDeterministicUUID(workflowSeed);

    const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const fixIds = (obj) => {
        if (typeof obj === "string" && uuidPattern.test(obj)) {
            return baseId;
        }

        if (obj && typeof obj === "object") {
            if (Array.isArray(obj)) {
                return obj.map((item) => fixIds(item));
            }
            const result = {};
            for (const [key, value] of Object.entries(obj)) {
                result[key] = fixIds(value);
            }
            return result;
        }

        return obj;
    };

    return fixIds(config);
};

workflowConfigs.forEach((config) => {
    const deterministicConfig = returnConfigWithFixedIds(config);
    const appName = config.subworkflows?.[0]?.application?.name || "unknown";
    const workflowName = config.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const filename = `${appName}_${workflowName}.json`;
    const filePath = path.resolve(workflowsDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(deterministicConfig, null, 2), "utf8");

    console.log(`Generated: ${filename}`);
});
