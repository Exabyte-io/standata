"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationFilterStandata = exports.FilterMode = void 0;
var FilterMode;
(function (FilterMode) {
    FilterMode["ANY_MATCH"] = "ANY";
    FilterMode["ALL_MATCH"] = "ALL";
})(FilterMode = exports.FilterMode || (exports.FilterMode = {}));
function safelyGet(obj, ...args) {
    let current = obj;
    // We use for instead of forEach to allow early return on undefined
    // eslint-disable-next-line no-restricted-syntax
    for (const arg of args) {
        if (current && typeof current === "object" && arg in current) {
            current = current[arg];
        }
        else {
            return undefined;
        }
    }
    return current;
}
function mergeTerminalNodes(obj) {
    if (!obj || typeof obj !== "object") {
        return [];
    }
    const results = [];
    function traverse(current) {
        if (Array.isArray(current)) {
            results.push(...current);
        }
        else if (current && typeof current === "object") {
            Object.values(current).forEach(traverse);
        }
    }
    traverse(obj);
    return results;
}
function extractUniqueBy(filterObjects, name) {
    const seen = new Set();
    return filterObjects.filter((obj) => {
        let value;
        if (name === "path" && "path" in obj) {
            value = obj.path;
        }
        else if (name === "regex" && "regex" in obj) {
            value = obj.regex;
        }
        if (!obj || !value || seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}
function getFilterObjects({ filterTree, name = "", version = "", build = "", executable = "", flavor = "", }) {
    let filterList;
    if (!name) {
        filterList = mergeTerminalNodes(filterTree);
    }
    else if (!version) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, name));
    }
    else if (!build) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, name, version));
    }
    else if (!executable) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, name, version, build));
    }
    else if (!flavor) {
        filterList = mergeTerminalNodes(safelyGet(filterTree, name, version, build, executable));
    }
    else {
        filterList = safelyGet(filterTree, name, version, build, executable, flavor) || [];
    }
    return [...extractUniqueBy(filterList, "path"), ...extractUniqueBy(filterList, "regex")];
}
function filterEntityList({ entitiesOrPaths, filterObjects, filterMode = FilterMode.ANY_MATCH, }) {
    if (!filterObjects || filterObjects.length === 0) {
        return entitiesOrPaths;
    }
    const matchesFilter = (entityPath, filter) => {
        if ("path" in filter) {
            return entityPath === filter.path || entityPath.includes(filter.path);
        }
        if ("regex" in filter) {
            try {
                const regex = new RegExp(filter.regex);
                return regex.test(entityPath);
            }
            catch (_a) {
                return false;
            }
        }
        return false;
    };
    return entitiesOrPaths.filter((entity) => {
        const entityPath = typeof entity === "string" ? entity : entity.path;
        if (!entityPath)
            return false;
        return filterMode === FilterMode.ALL_MATCH
            ? filterObjects.every((filter) => matchesFilter(entityPath, filter))
            : filterObjects.some((filter) => matchesFilter(entityPath, filter));
    });
}
class ApplicationFilterStandata {
    constructor(filterTree, filterMode = FilterMode.ANY_MATCH) {
        this.filterTree = filterTree || {};
        this.filterMode = filterMode;
    }
    filterByApplicationParameters(entityList, name, version, build, executable, flavor) {
        const filterObjects = getFilterObjects({
            filterTree: this.filterTree,
            name,
            version,
            build,
            executable,
            flavor,
        });
        return filterEntityList({
            entitiesOrPaths: entityList,
            filterObjects,
            filterMode: this.filterMode,
        });
    }
    getAvailableEntities(name) {
        return this.filterTree[name] || {};
    }
}
exports.ApplicationFilterStandata = ApplicationFilterStandata;
