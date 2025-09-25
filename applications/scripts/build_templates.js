/**
 * build_templates uses node API to read all jinja templates from the FS
 * at build time and writes them out to a single templates.js file for
 * downstream consumption to avoid FS calls in the browser.
 */
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const utils = require("@mat3ra/code/dist/js/utils");

function buildAsset({ assetPath, targetPath, workingDir = null }) {
    const originalCwd = process.cwd();

    try {
        // Change to the working directory if specified (for resolving includes)
        if (workingDir) {
            process.chdir(path.resolve(originalCwd, workingDir));
        }

        const fileContent = fs.readFileSync(assetPath);
        const obj = yaml.load(fileContent, { schema: utils.JsYamlAllSchemas });

        // Write as JSON instead of JS
        fs.writeFileSync(
            path.resolve(originalCwd, targetPath),
            JSON.stringify(obj, null, 2),
            "utf8",
        );
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
    } finally {
        // Always restore the original working directory
        process.chdir(originalCwd);
    }
}

// Build templates JSON
buildAsset({
    assetPath: "templates/templates.yml",
    targetPath: "./applications/templatesByApplication.json",
    workingDir: "./applications/sources",
});

// Build application data JSON
buildAsset({
    assetPath: "applications/application_data.yml",
    targetPath: "./applications/applicationDataByApplication.json",
    workingDir: "./applications/sources",
});

// Build application tree JSON
buildAsset({
    assetPath: "executables/tree.yml",
    targetPath: "./applications/executableFlavorByApplication.json",
    workingDir: "./applications/sources",
});

console.log("All application JSONs built successfully!");
