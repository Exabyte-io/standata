import { execSync } from "child_process";
import * as path from "path";

import BUILD_CONFIG from "../../build-config";
import { writeJSONFile } from "../utils";

interface MaterialOutput {
    filename: string;
    data: any;
}

/**
 * Build materials by running Python script and writing output using standard formatting
 */
function buildMaterials() {
    // Run the Python script and capture JSON output
    const output = execSync("python scripts/materials/create_materials.py", {
        encoding: "utf8",
    });

    const materials: MaterialOutput[] = JSON.parse(output);

    const materialsDir = BUILD_CONFIG.materials.data.path;

    materials.forEach(({ filename, data }) => {
        const filePath = path.join(materialsDir, `${filename}.json`);
        writeJSONFile(filePath, data);
        console.log(`  Created: ${filename}.json`);
    });
}

if (require.main === module) {
    buildMaterials();
}

export { buildMaterials };
