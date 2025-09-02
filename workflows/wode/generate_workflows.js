const fs = require("fs");
const path = require("path");
const { createWorkflowConfigs } = require("@exabyte-io/wode.js");

// This script uses the actual wode createWorkflowConfigs function to generate
// final workflow JSON files from the workflowData

// Read the workflowData and temporarily set it globally for wode to access
const workflowDataPath = path.resolve(__dirname, "workflows_data.json");
const { workflowData } = JSON.parse(fs.readFileSync(workflowDataPath, "utf8"));

console.log("Loaded workflow data from:", workflowDataPath);

// Temporarily monkey-patch the workflowData for wode to use
// This is needed because wode expects to import workflowData from its own module
const Module = require("module");

const originalRequire = Module.prototype.require;

Module.prototype.require = function (id) {
    if (id.includes("workflows") && id.includes("workflowData")) {
        return { workflowData };
    }
    return originalRequire.apply(this, arguments);
};

const workflowConfigs = createWorkflowConfigs();

// Restore original require function
Module.prototype.require = originalRequire;

const workflowsDir = path.resolve(__dirname, "..");

workflowConfigs.forEach((config) => {
    // Generate filename based on application and workflow name
    const appName = config.subworkflows?.[0]?.application?.name || "unknown";
    const workflowName = config.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const filename = `${appName}_${workflowName}.json`;
    const filePath = path.resolve(workflowsDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");

    console.log(`Generated: ${filename}`);
});
