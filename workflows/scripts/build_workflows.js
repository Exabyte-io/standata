const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { createWorkflowConfigs } = require("@exabyte-io/wode.js");
const wodeWorkflowsStore = require("@exabyte-io/wode.js/dist/workflows/workflows");
const { sharedUtils } = require("@mat3ra/utils");

const { getUUIDFromNamespace } = sharedUtils.uuid;

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

const workflowConfigs = createWorkflowConfigs(null, applications, workflowData);

const workflowsDir = path.resolve(__dirname, "..");

// Recursively traverse an object and replace UUIDs with a new common UUID
function setUUIDsInObject(obj, newUUID) {
    const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (typeof obj === "string" && uuidPattern.test(obj)) {
        return newUUID;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => setUUIDsInObject(item, newUUID));
    }
    if (obj && typeof obj === "object") {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => [key, setUUIDsInObject(value, newUUID)]),
        );
    }
    return obj;
}

function returnConfigWithFixedIds(config) {
    const newUUID = getUUIDFromNamespace(config.name);
    return setUUIDsInObject(config, newUUID);
}

workflowConfigs.forEach((config) => {
    const deterministicConfig = returnConfigWithFixedIds(config);
    const appName = config.subworkflows?.[0]?.application?.name || "unknown";
    const workflowName = config.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const filename = `${appName}_${workflowName}.json`;
    const filePath = path.resolve(workflowsDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(deterministicConfig, null, 2), "utf8");

    console.log(`Generated: ${filename}`);
});
