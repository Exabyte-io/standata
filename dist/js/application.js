"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStandata = void 0;
const base_1 = require("./base");
const applications_json_1 = __importDefault(require("./runtime_data/applications.json"));
const executableFlavorMapByApplication_json_1 = __importDefault(require("./runtime_data/executableFlavorMapByApplication.json"));
const templatesList_json_1 = __importDefault(require("./runtime_data/templatesList.json"));
class ApplicationStandata extends base_1.Standata {
    getAppDataForApplication(appName) {
        const allEntities = this.getAll();
        const appEntities = allEntities.filter((entity) => entity.name === appName);
        if (appEntities.length === 0) {
            throw new Error(`Application ${appName} not found`);
        }
        return appEntities[0];
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
    getAllApplicationNames() {
        const allApps = this.getAll();
        const uniqueNames = new Set(allApps.map((app) => app.name));
        return Array.from(uniqueNames);
    }
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
    getByApplicationName(appName) {
        const allEntities = this.getAll();
        return allEntities.filter((entity) => entity.name === appName);
    }
}
exports.ApplicationStandata = ApplicationStandata;
ApplicationStandata.runtimeData = applications_json_1.default;
