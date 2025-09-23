import { Standata } from "./base";
import APPLICATIONS from "./runtime_data/applications.json";
import MODEL_METHOD_DATA from "./runtime_data/modelMethodMapByApplication.json";

export class ApplicationStandata extends Standata {
    static runtimeData = APPLICATIONS;
}

function safelyGet(obj: any, ...args: string[]): any {
    let current = obj;
    for (const arg of args) {
        if (current && typeof current === "object" && arg in current) {
            current = current[arg];
        } else {
            return undefined;
        }
    }
    return current;
}

function mergeTerminalNodes(obj: any): any[] {
    if (!obj || typeof obj !== "object") {
        return [];
    }

    const results: any[] = [];

    function traverse(current: any) {
        if (Array.isArray(current)) {
            results.push(...current);
        } else if (current && typeof current === "object") {
            Object.values(current).forEach(traverse);
        }
    }

    traverse(obj);
    return results;
}

function extractUniqueBy(filterObjects: any[], name: string): any[] {
    const seen = new Set();
    return filterObjects.filter((obj) => {
        if (!obj || !obj[name] || seen.has(obj[name])) {
            return false;
        }
        seen.add(obj[name]);
        return true;
    });
}

function getFilterObjects({
    filterTree,
    applicationName = "",
    version = "",
    build = "",
    executable = "",
    flavor = "",
}: {
    filterTree: any;
    applicationName?: string;
    version?: string;
    build?: string;
    executable?: string;
    flavor?: string;
}) {
    let filterList: any[];

    // Use Default build when the filterTree does not contain the build specified
    const build_ =
        !safelyGet(filterTree, applicationName, version, build) &&
        safelyGet(filterTree, applicationName, version, "Default")
            ? "Default"
            : build;

    if (!applicationName) {
        filterList = mergeTerminalNodes(filterTree);
    } else if (!version) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, applicationName));
    } else if (!build_) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, applicationName, version));
    } else if (!executable) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, applicationName, version, build_));
    } else if (!flavor) {
        filterList = mergeTerminalNodes(
            safelyGet(filterTree, applicationName, version, build_, executable),
        );
    } else {
        filterList =
            safelyGet(filterTree, applicationName, version, build_, executable, flavor) || [];
    }

    return [...extractUniqueBy(filterList, "path"), ...extractUniqueBy(filterList, "regex")];
}

function filterEntityList({
    entitiesOrPaths,
    filterObjects,
}: {
    entitiesOrPaths: any[];
    filterObjects: any[];
}): any[] {
    if (!filterObjects || filterObjects.length === 0) {
        return entitiesOrPaths;
    }

    return entitiesOrPaths.filter((entity) => {
        const entityPath = typeof entity === "string" ? entity : entity.path;
        if (!entityPath) return false;

        return filterObjects.some((filter) => {
            if (filter.path) {
                return entityPath === filter.path || entityPath.includes(filter.path);
            }
            if (filter.regex) {
                try {
                    const regex = new RegExp(filter.regex);
                    return regex.test(entityPath);
                } catch {
                    return false;
                }
            }
            return false;
        });
    });
}

export abstract class ApplicationFilterStandata {
    protected filterTree: any;

    constructor(treeType: "models" | "methods") {
        const data = MODEL_METHOD_DATA as any;
        this.filterTree = data?.[treeType] || {};
    }

    protected filterByApplicationParameters(
        entityList: any[],
        applicationName: string,
        version?: string,
        build?: string,
        executable?: string,
        flavor?: string,
    ): any[] {
        const filterObjects = getFilterObjects({
            filterTree: this.filterTree,
            applicationName,
            version,
            build,
            executable,
            flavor,
        });

        return filterEntityList({
            entitiesOrPaths: entityList,
            filterObjects,
        });
    }

    getAvailableEntities(applicationName: string): any {
        return this.filterTree[applicationName] || {};
    }
}
