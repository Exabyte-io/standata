const fs = require("fs");
const path = require("path");
const { createWorkflowConfigs } = require("@exabyte-io/wode.js");

const workflowDataPath = path.resolve(__dirname, "..", "generated", "workflows_data.json");
const { workflowData } = JSON.parse(fs.readFileSync(workflowDataPath, "utf8"));

const workflowConfigs = createWorkflowConfigs(null, [], workflowData);

const workflowsDir = path.resolve(__dirname, "..", "..");

const returnConfigWithFixedIds = (config) => {
    const hash = require("crypto")
        .createHash("md5")
        .update(config.name)
        .digest("hex")
        .substring(0, 8);
    const baseId = `${hash}-0000-0000-0000-000000000000`;

    const fixIds = (obj) => {
        if (obj._id) obj._id = baseId;
        if (obj.flowchartId) obj.flowchartId = baseId;
        Object.values(obj).forEach((val) => {
            if (val && typeof val === "object") fixIds(val);
        });
    };

    fixIds(config);
    return config;
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
