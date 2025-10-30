// eslint-disable-next-line import/no-extraneous-dependencies
import { JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
//
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as lodash from "lodash";
import * as path from "path";

const IGNORE_MARKER = Symbol("YAML_IGNORE");

const ignoreType = new yaml.Type("!ignore", {
    kind: "mapping",
    construct: (data) => ({ ...data, [IGNORE_MARKER]: true }),
});

const schemaWithIgnore = JsYamlAllSchemas.extend([ignoreType]);

export function readYAMLFileResolved(filePath: string): any {
    return serverUtils.yaml.readYAMLFile(filePath, { schema: schemaWithIgnore });
}

export function hasIgnoreDirective(data: any): boolean {
    return data?.[IGNORE_MARKER] === true;
}

export function resolveFromRoot(scriptDirname: string, ...pathSegments: string[]): string {
    return path.resolve(scriptDirname, "../..", ...pathSegments);
}

/**
 * Converts YAML file to JSON, optionally resolving relative includes from a working directory
 */
export function buildJSONFromYAMLInDir({
    assetPath,
    targetPath,
    workingDir,
    spaces = 0,
}: {
    assetPath: string;
    targetPath: string;
    workingDir?: string;
    spaces?: number;
}): any {
    const originalCwd = process.cwd();
    try {
        if (workingDir) {
            process.chdir(workingDir);
        }

        const data = readYAMLFileResolved(assetPath);
        const resolvedTargetPath = workingDir ? path.resolve(originalCwd, targetPath) : targetPath;

        serverUtils.json.writeJSONFileSync(resolvedTargetPath, data, {
            spaces,
        });
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
        return data;
    } finally {
        if (workingDir) {
            process.chdir(originalCwd);
        }
    }
}

/**
 * Traverses a directory and processes YAML files with a callback.
 */
function traverseYAMLFiles(
    rootPath: string,
    callback: (filePath: string, data: any) => void,
): void {
    function traverse(currentPath: string) {
        if (!fs.existsSync(currentPath)) return;

        const stat = fs.statSync(currentPath);

        if (stat.isDirectory()) {
            const items = fs.readdirSync(currentPath);
            items.forEach((item) => traverse(path.join(currentPath, item)));
        } else if (stat.isFile() && /\.(yml|yaml)$/i.test(currentPath)) {
            try {
                const data = readYAMLFileResolved(currentPath);
                if (hasIgnoreDirective(data)) {
                    console.log(`  Ignoring: ${currentPath} (marked with !ignore)`);
                    return;
                }
                callback(currentPath, data);
            } catch (error) {
                console.error(`Error loading ${currentPath}:`, error);
            }
        }
    }

    traverse(rootPath);
}

// Functions for processing entities from YAML files to JSON files when some processing inside the files is needed

/**
 * Loads a directory tree of YAML files into a nested object structure.
 * Uses lodash-compatible object paths for nested structure.
 */
export function loadYAMLTree(rootPath: string): Record<string, any> {
    const tree: Record<string, any> = {};

    traverseYAMLFiles(rootPath, (filePath, data) => {
        const objectPath = serverUtils.file.createObjectPathFromFilePath(filePath, rootPath);
        lodash.set(tree, objectPath, data);
    });

    return tree;
}
// Legacy procedural interfaces (unused) removed

/**
 * Encodes entity data as a URL path with categories and parameters.
 */
export function encodeDataAsURLPath(
    data: any,
    categoryKeys: string[] = [],
    placeholder = "none",
): string {
    const pathSegments = categoryKeys.map((key) => data.categories?.[key] || placeholder).join("/");

    const params = new URLSearchParams();
    if (data.parameters) {
        Object.entries(data.parameters).forEach(([key, value]) => {
            const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
            params.append(key, stringValue);
        });
    }

    return params.toString() ? `/${pathSegments}?${params.toString()}` : `/${pathSegments}`;
}

/**
 * Builds entity JSON files from YAML sources when some processing is needed.
 */
//

/**
 * Processes and saves an entity with standard operations:
 * encodes path, deletes schema, determines subdirectory, and saves.
 */
//

/**
 * Loads YAML files from a directory and stores them in a map keyed by filename (without extension).
 * Recursively searches subdirectories. Adds __path__ metadata with the relative path.
 *
 * Example:
 *   Input: assets/workflows/subworkflows/python/
 *     - python_script.yml
 *     - ml/classification_tail.yml
 *   Output: {
 *     python_script: { __path__: "python_script", ... },
 *     classification_tail: { __path__: "ml/classification_tail", ... }
 *   }
 */
export function loadYAMLFilesAsMap(dirPath: string): Record<string, any> {
    const result: Record<string, any> = {};

    traverseYAMLFiles(dirPath, (filePath, data) => {
        const key = path.basename(filePath).replace(/\.(yml|yaml)$/i, "");
        const relativePath = path.relative(dirPath, filePath).replace(/\.(yml|yaml)$/i, "");
        result[key] = { __path__: relativePath, ...data };
    });

    return result;
}

// Classes moved to scripts/processors/*; keep only shared helpers in this file
