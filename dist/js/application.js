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
        const appEntities = this.findEntitiesByTags(appName);
        if (appEntities.length === 0) {
            throw new Error(`${appName} is not a known application with data.`);
        }
        return appEntities[0];
    }
    static getAppTreeForApplication(appName) {
        const executableData = executableFlavorMapByApplication_json_1.default;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        return executableData[appName];
    }
    static getAllAppTemplates() {
        return templatesList_json_1.default;
    }
    static getAllAppTree() {
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
    static getTemplatesByName(appName, execName, templateName) {
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
        return this.findEntitiesByTags(appName);
    }
}
exports.ApplicationStandata = ApplicationStandata;
ApplicationStandata.runtimeData = applications_json_1.default;
