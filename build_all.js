#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");
const { execFile } = require("child_process");

const arg = process.argv[2];

const pipelines = {
    workflows: [
        "workflows/scripts/build_workflows_data.js",
        "workflows/scripts/create_workflows.js",
    ],
    applications: ["applications/scripts/build_applications.js"],
};

function executeScript(scriptPath) {
    const fullPath = path.resolve(process.cwd(), scriptPath);
    return new Promise((resolve) => {
        execFile(process.execPath, [fullPath], { stdio: "inherit" }, (error) => {
            if (error) {
                console.error(`❌ Error executing ${scriptPath}:`);
                console.error(error.message);
                console.error(error.stack);
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

async function runScripts(scripts) {
    const runSequentially = scripts.reduce((promiseChain, script, index) => {
        return promiseChain.then(async (ok) => {
            if (!ok) return false;
            const success = await executeScript(script);
            if (!success) {
                console.error(`\n❌ Pipeline failed at step ${index + 1}: ${script}`);
            }
            return success;
        });
    }, Promise.resolve(true));

    const allOk = await runSequentially;
    if (!allOk) process.exit(1);
}

async function main() {
    await runScripts(pipelines[arg]);
    console.log(`✅ Completed ${arg} generation pipeline`);
}

main().catch((error) => {
    console.error("❌ Unexpected error in pipeline:");
    console.error(error);
    process.exit(1);
});
