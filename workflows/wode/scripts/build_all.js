#!/usr/bin/env node

const path = require("path");

const scripts = [
    "workflows/wode/scripts/build_workflows_data.js",
    "workflows/wode/scripts/create_workflows.js",
    "workflows/wode/scripts/update_categories.js",
];

async function executeScript(scriptPath) {
    const fullPath = path.resolve(process.cwd(), scriptPath);

    try {
        require(fullPath);

        console.log(`✅ Completed: ${scriptPath}\n`);
        return true;
    } catch (error) {
        console.error(`❌ Error executing ${scriptPath}:`);
        console.error(error.message);
        console.error(error.stack);
        return false;
    }
}

async function runPipeline() {
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const success = await executeScript(script);

        if (!success) {
            console.error(`\n❌ Pipeline failed at step ${i + 1}: ${script}`);
            process.exit(1);
        }
    }

    console.log("✅ Complete workflow generation pipeline completed successfully!");
}

runPipeline().catch((error) => {
    console.error("❌ Unexpected error in pipeline:");
    console.error(error);
    process.exit(1);
});
