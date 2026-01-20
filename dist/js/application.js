"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStandata = exports.TAGS = void 0;
const base_1 = require("./base");
const applications_json_1 = __importDefault(require("./runtime_data/applications.json"));
const applicationVersionsMapByApplication_json_1 = __importDefault(require("./runtime_data/applications/applicationVersionsMapByApplication.json"));
const executableFlavorMapByApplication_json_1 = __importDefault(require("./runtime_data/applications/executableFlavorMapByApplication.json"));
const templatesList_json_1 = __importDefault(require("./runtime_data/applications/templatesList.json"));
const applicationVersionMap_1 = require("./utils/applicationVersionMap");
const TEMPLATES_LIST = templatesList_json_1.default;
const APP_VERSIONS = applicationVersionsMapByApplication_json_1.default;
const EXECUTABLE_FLAVOR = executableFlavorMapByApplication_json_1.default;
var TAGS;
(function (TAGS) {
    TAGS["DEFAULT"] = "default";
    TAGS["DEFAULT_VERSION"] = "default_version";
    TAGS["DEFAULT_BUILD"] = "default_build";
})(TAGS || (exports.TAGS = TAGS = {}));
class ApplicationStandata extends base_1.Standata {
    getAppDataForApplication(appName) {
        const applicationVersionsMap = APP_VERSIONS[appName];
        if (!applicationVersionsMap) {
            throw new Error(`Application ${appName} not found`);
        }
        return applicationVersionsMap;
    }
    getAppTreeForApplication(appName) {
        // TODO: Convert to use this.findEntitiesByTags() when tree data is in Standata format
        const executableData = EXECUTABLE_FLAVOR;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        return executableData[appName];
    }
    getAllAppTemplates() {
        // TODO: Convert to use this.getAll() when template data is in Standata format
        return TEMPLATES_LIST;
    }
    getAllAppTree() {
        // TODO: Convert to use this.getAll() when tree data is in Standata format
        return executableFlavorMapByApplication_json_1.default;
    }
    // TODO: move to parent class Standata
    getAllApplicationNames() {
        const allApps = this.getAll();
        const uniqueNames = new Set(allApps.map((app) => app.name));
        return Array.from(uniqueNames);
    }
    // TODO: move to parent class Standata
    getAllAppData() {
        return this.getAll();
    }
    getTemplatesByName(appName, execName, templateName) {
        // TODO: Convert to use this.findEntitiesByTags() when template data is in Standata format
        const templates = TEMPLATES_LIST;
        const filtered = templates.filter((template) => {
            const matchesApp = template.applicationName === appName;
            const matchesExec = template.executableName === execName;
            return matchesApp && matchesExec;
        });
        if (!templateName) {
            return filtered;
        }
        return filtered.filter((template) => template.name === templateName);
    }
    // TODO: move to parent class Standata
    getByApplicationName(appName) {
        const allEntities = this.getAll();
        return allEntities.filter((entity) => entity.name === appName);
    }
    static getDefaultVersionForApplication(appName) {
        const applicationVersionsMap = new applicationVersionMap_1.ApplicationVersionsMap(APP_VERSIONS[appName]);
        return applicationVersionsMap.defaultVersion;
    }
    static getDefaultBuildForApplicationAndVersion(appName, version) {
        const applicationVersionsMap = new applicationVersionMap_1.ApplicationVersionsMap(APP_VERSIONS[appName]);
        const versionConfig = applicationVersionsMap.versionConfigs.find((config) => config.version === version && config.isDefault);
        if (!versionConfig) {
            throw new Error(`No default build found for ${appName} with version ${version}`);
        }
        if (!versionConfig.build) {
            throw new Error(`No build specified for default config of ${appName} with version ${version}`);
        }
        return versionConfig.build;
    }
    // TODO: move to parent class Standata, name and generic parameters
    getDefaultConfigByNameAndVersion(appName, version) {
        const tags = [TAGS.DEFAULT_BUILD];
        let versionToUse = version;
        if (!versionToUse) {
            tags.push(TAGS.DEFAULT_VERSION);
            versionToUse = ApplicationStandata.getDefaultVersionForApplication(appName);
        }
        const allEntriesWithTags = this.findEntitiesByTags(...tags);
        const allEntriesWithTagsForNameAndVersion = allEntriesWithTags.filter((entity) => {
            return entity.name === appName && entity.version === versionToUse;
        });
        if (allEntriesWithTagsForNameAndVersion.length > 1) {
            throw new Error(`Multiple default version entries found for ${appName} with version ${versionToUse}`);
        }
        else if (allEntriesWithTagsForNameAndVersion.length === 0) {
            throw new Error(`No default version entry found for ${appName} with version ${versionToUse}`);
        }
        return allEntriesWithTagsForNameAndVersion[0];
    }
    getDefaultConfig() {
        const fullConfig = this.findEntitiesByTags(TAGS.DEFAULT)[0];
        const { name, shortName, version, summary, build } = fullConfig;
        return { name, shortName, version, summary, build };
    }
}
exports.ApplicationStandata = ApplicationStandata;
ApplicationStandata.runtimeData = applications_json_1.default;
