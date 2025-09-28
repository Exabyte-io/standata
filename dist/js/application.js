"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStandata = exports.TAGS = void 0;
const base_1 = require("./base");
const applications_json_1 = __importDefault(require("./runtime_data/applications.json"));
const applicationVersionsMapByApplication_json_1 = __importDefault(require("./runtime_data/applicationVersionsMapByApplication.json"));
const executableFlavorMapByApplication_json_1 = __importDefault(require("./runtime_data/executableFlavorMapByApplication.json"));
const templatesList_json_1 = __importDefault(require("./runtime_data/templatesList.json"));
const applicationVersionMap_1 = require("./utils/applicationVersionMap");
var TAGS;
(function (TAGS) {
    TAGS["DEFAULT_VERSION"] = "default_version";
    TAGS["DEFAULT_BUILD"] = "default_build";
})(TAGS = exports.TAGS || (exports.TAGS = {}));
class ApplicationStandata extends base_1.Standata {
    getAppDataForApplication(appName) {
        const applicationVersionsMap = applicationVersionsMapByApplication_json_1.default[appName];
        if (!applicationVersionsMap) {
            throw new Error(`Application ${appName} not found`);
        }
        return applicationVersionsMap;
    }
    // eslint-disable-next-line class-methods-use-this
    getAppTreeForApplication(appName) {
        // TODO: Convert to use this.findEntitiesByTags() when tree data is in Standata format
        const executableData = executableFlavorMapByApplication_json_1.default;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        return executableData[appName];
    }
    // eslint-disable-next-line class-methods-use-this
    getAllAppTemplates() {
        // TODO: Convert to use this.getAll() when template data is in Standata format
        return templatesList_json_1.default;
    }
    // eslint-disable-next-line class-methods-use-this
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
    // eslint-disable-next-line class-methods-use-this
    getTemplatesByName(appName, execName, templateName) {
        // TODO: Convert to use this.findEntitiesByTags() when template data is in Standata format
        const templates = templatesList_json_1.default;
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
        const applicationVersionsMap = new applicationVersionMap_1.ApplicationVersionsMap(applicationVersionsMapByApplication_json_1.default[appName]);
        return applicationVersionsMap.defaultVersion;
    }
    static getDefaultBuildForApplicationAndVersion(appName, version) {
        const applicationVersionsMap = new applicationVersionMap_1.ApplicationVersionsMap(applicationVersionsMapByApplication_json_1.default[appName]);
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
}
exports.ApplicationStandata = ApplicationStandata;
ApplicationStandata.runtimeData = applications_json_1.default;
