#!/usr/bin/env node

const path = require("path");

const scripts = [
    "applications/application_flavors/scripts/build_application_flavors_data.js",
    "applications/application_flavors/scripts/build_standata_format.js",
    "applications/application_flavors/scripts/build_js_runtime_data.js",
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

    console.log("✅ Complete application flavors generation pipeline completed successfully!");
}

runPipeline().catch((error) => {
    console.error("❌ Unexpected error in pipeline:");
    console.error(error);
    process.exit(1);
});
