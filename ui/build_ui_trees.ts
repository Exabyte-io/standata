/* This script build the RJSF schemas for models and methods from the Yaml assets in `./ui`.
 */
import * as fs from "fs";
import * as path from "path";

import { readYAMLFileResolved } from "../scripts/utils";

function getUiTreesFileContent(): string {
    const originalCwd = process.cwd();
    try {
        process.chdir("ui");

        const methodTree = readYAMLFileResolved("method.yml");
        const modelTree = readYAMLFileResolved("model.yml");

        const exportObject = {
            method: methodTree,
            model: modelTree,
        };

        const ignore = "/* eslint-disable */\n";
        return ignore + `module.exports = ${JSON.stringify(exportObject)}`;
    } finally {
        process.chdir(originalCwd);
    }
}


try {
    const outputDir = path.join("ui", "data");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const uiTreesPath = path.join(outputDir, "ui_trees.js");

    fs.writeFileSync(uiTreesPath, getUiTreesFileContent(), "utf8");
    console.log(`Generated: ${uiTreesPath}`);

} catch (e) {
    console.error("Error generating UI trees:", e);
    process.exit(1);
}
