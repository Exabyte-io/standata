#!/usr/bin/env node

const path = require("path");

const arg = process.argv[2];

const pipelines = {
    workflows: [
        "workflows/wode/scripts/build_workflows_data.js",
        "workflows/wode/scripts/create_workflows.js",
        "workflows/wode/scripts/update_categories.js",
    ],
    applications: ["applications/application_flavors/scripts/build_applications.js"],
};

async function main() {
    if (!arg || !(arg in pipelines)) {
        console.error("Usage: node scripts/build_all.js <workflows|applications>");
        process.exit(1);
    }
    await runScripts(pipelines[arg]);
    console.log(`✅ Completed ${arg} generation pipeline`);
}

main().catch((error) => {
    console.error("❌ Unexpected error in pipeline:");
    console.error(error);
    process.exit(1);
});

async function executeScript(scriptPath) {
    const fullPath = path.resolve(process.cwd(), scriptPath);
    try {
        require(fullPath);
        return true;
    } catch (error) {
        console.error(`❌ Error executing ${scriptPath}:`);
        console.error(error.message);
        console.error(error.stack);
        return false;
    }
}

async function runScripts(scripts) {
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const success = await executeScript(script);
        if (!success) {
            console.error(`\n❌ Pipeline failed at step ${i + 1}: ${script}`);
            process.exit(1);
        }
    }
}
