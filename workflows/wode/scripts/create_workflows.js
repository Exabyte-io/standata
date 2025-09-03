const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { createWorkflowConfigs } = require("@exabyte-io/wode.js");

const workflowDataPath = path.resolve(__dirname, "..", "generated", "workflows_data.json");
const { workflowData } = JSON.parse(fs.readFileSync(workflowDataPath, "utf8"));

// Inject generated workflowData into wode.js internal workflows store
const wodeWorkflowsStore = require("@exabyte-io/wode.js/dist/workflows/workflows");

wodeWorkflowsStore.workflowData = workflowData;

const workflowConfigs = createWorkflowConfigs(null, workflowData);

const workflowsDir = path.resolve(__dirname, "..", "..");

const returnConfigWithFixedIds = (config) => {
    const uuidRegex = /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi;
    const seed = crypto
        .createHash("md5")
        .update(config.name || "")
        .digest("hex");
    const toUuid = (h) => `${h.slice(0, 8)}-0000-0000-0000-000000000000`;
    const cache = new Map();
    let i = 0;
    const json = JSON.stringify(config);
    const resultString = json.replace(uuidRegex, (match) => {
        match = match.toLowerCase();
        if (!cache.has(match))
            cache.set(
                match,
                toUuid(crypto.createHash("md5").update(`${seed}:${i++}`).digest("hex")),
            );
        return cache.get(match);
    });
    return JSON.parse(resultString);
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
