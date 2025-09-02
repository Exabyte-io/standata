#!/usr/bin/env node

/**
 * Complete workflow generation pipeline for standata
 *
 * This script orchestrates the entire workflow generation process by executing
 * a series of build scripts in sequence.
 *
 * Usage:
 *   node workflows/wode/build_all.js [script1] [script2] [script3] ...
 *
 * Default scripts (if no arguments provided):
 *   - workflows/wode/build_workflows.js
 *   - workflows/wode/generate_workflows.js
 *   - workflows/wode/update_categories.js
 *   - build_runtime_data.js
 */

const path = require("path");

const scripts = [
    "workflows/wode/build_workflows.js",
    "workflows/wode/generate_workflows.js",
    "workflows/wode/update_categories.js",
    "build_runtime_data.js",
];

async function executeScript(scriptPath) {
    const fullPath = path.resolve(process.cwd(), scriptPath);

    try {
        // Use require() to execute the script module
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
