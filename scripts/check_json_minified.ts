import * as fs from "fs";
import * as path from "path";

const RUNTIME_DATA_DIR = path.resolve(__dirname, "../dist/js/runtime_data");

function findJsonFilesRecursively(dir: string): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) {
        return results;
    }
    const items = fs.readdirSync(dir);
    items.forEach((item) => {
        const full = path.join(dir, item);
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
            results.push(...findJsonFilesRecursively(full));
        } else if (stat.isFile() && item.endsWith(".json")) {
            results.push(full);
        }
    });
    return results;
}

function isMinified(filePath: string): boolean {
    const content = fs.readFileSync(filePath, "utf8");
    const trimmed = content.trim();
    const lines = trimmed.split("\n");
    if (lines.length > 1) {
        return false;
    }
    try {
        const parsed = JSON.parse(trimmed);
        const minified = JSON.stringify(parsed);
        return trimmed === minified;
    } catch {
        return false;
    }
}

function checkJsonFilesMinified(): void {
    if (!fs.existsSync(RUNTIME_DATA_DIR)) {
        console.log(`Directory ${RUNTIME_DATA_DIR} does not exist. Skipping check.`);
        process.exit(0);
    }

    const jsonFiles = findJsonFilesRecursively(RUNTIME_DATA_DIR);
    const errors: string[] = [];

    jsonFiles.forEach((filePath) => {
        if (!isMinified(filePath)) {
            const relativePath = path.relative(process.cwd(), filePath);
            errors.push(relativePath);
        }
    });

    if (errors.length > 0) {
        console.error("❌ The following JSON files are not minified (contain formatting like newlines or unnecessary whitespace):");
        errors.forEach((file) => console.error(`  - ${file}`));
        process.exit(1);
    }

    console.log(`✅ All ${jsonFiles.length} JSON files in dist/js/runtime_data are minified.`);
}

checkJsonFilesMinified();
