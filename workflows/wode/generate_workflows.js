const fs = require("fs");
const path = require("path");
const { createWorkflowConfigs } = require("@exabyte-io/wode.js");

const workflowDataPath = path.resolve(__dirname, "workflows_data.json");
const { workflowData } = JSON.parse(fs.readFileSync(workflowDataPath, "utf8"));

const workflowConfigs = createWorkflowConfigs(null, [], workflowData);

const workflowsDir = path.resolve(__dirname, "..");

workflowConfigs.forEach((config) => {
    const appName = config.subworkflows?.[0]?.application?.name || "unknown";
    const workflowName = config.name.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const filename = `${appName}_${workflowName}.json`;
    const filePath = path.resolve(workflowsDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");

    console.log(`Generated: ${filename}`);
});
