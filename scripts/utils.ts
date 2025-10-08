import { JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as lodash from "lodash";
import * as path from "path";

import BUILD_CONFIG from "../build-config";

export function ensureDirectory(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

export function readYamlFile(filePath: string): any {
    const content = fs.readFileSync(filePath, "utf-8");
    return yaml.load(content, { schema: JsYamlAllSchemas });
}

export function writeYamlFile(filePath: string, data: any): void {
    ensureDirectory(path.dirname(filePath));
    const content = yaml.dump(data, { ...BUILD_CONFIG.yamlFormat });
    fs.writeFileSync(filePath, content, "utf-8");
}

export function readJsonFile(filePath: string): any {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

export function writeJsonFile(
    filePath: string,
    data: any,
    spaces: number = BUILD_CONFIG.jsonFormat.spaces,
): void {
    ensureDirectory(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, spaces), "utf-8");
}

export function findFiles(dir: string, extensions: string[]): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            files.push(...findFiles(fullPath, extensions));
        } else if (extensions.some((ext) => item.endsWith(ext))) {
            files.push(fullPath);
        }
    });

    return files;
}

/**
 * Clears all files and subdirectories in the specified directory,
 * optionally excluding a specific file from deletion.
 */
export function clearDirectory(dirPath: string, excludeFile?: string): void {
    if (!fs.existsSync(dirPath)) return;

    const items = fs.readdirSync(dirPath);
    items.forEach((item) => {
        if (item === excludeFile) return;

        const itemPath = path.join(dirPath, item);
        if (fs.statSync(itemPath).isDirectory()) {
            fs.rmSync(itemPath, { recursive: true });
        } else {
            fs.unlinkSync(itemPath);
        }
    });
}

export function createSafeFilename(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

/**
 * Converts YAML file to JSON, optionally resolving relative includes from a working directory
 */
export function buildJsonFromYamlInDir(
    assetPath: string,
    targetPath: string,
    workingDir?: string,
    spaces = 0,
): any {
    const originalCwd = process.cwd();
    try {
        if (workingDir) {
            process.chdir(workingDir);
        }

        const data = readYamlFile(assetPath);
        const resolvedTargetPath = workingDir ? path.resolve(originalCwd, targetPath) : targetPath;

        writeJsonFile(resolvedTargetPath, data, spaces);
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
        return data;
    } finally {
        if (workingDir) {
            process.chdir(originalCwd);
        }
    }
}

/**
 * Loads a directory tree of YAML files into a nested object structure.
 */
export function loadYamlTree(
    rootPath: string,
    createObjectPath: (filePath: string, rootPath: string) => string,
): Record<string, any> {
    const tree: Record<string, any> = {};

    function traverse(currentPath: string) {
        if (!fs.existsSync(currentPath)) return;

        const stat = fs.statSync(currentPath);

        if (stat.isDirectory()) {
            const items = fs.readdirSync(currentPath);
            items.forEach((item) => traverse(path.join(currentPath, item)));
        } else if (stat.isFile() && /\.(yml|yaml)$/i.test(currentPath)) {
            try {
                const data = readYamlFile(currentPath);
                const objectPath = createObjectPath(currentPath, rootPath);
                lodash.set(tree, objectPath, data);
            } catch (error) {
                console.error(`Error loading ${currentPath}:`, error);
            }
        }
    }

    traverse(rootPath);
    return tree;
}
