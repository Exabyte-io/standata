"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationStandata = void 0;
const base_1 = require("./base");
const applicationDataMapByApplication_json_1 = __importDefault(require("./runtime_data/applicationDataMapByApplication.json"));
const applications_json_1 = __importDefault(require("./runtime_data/applications.json"));
const executableFlavorMapByApplication_json_1 = __importDefault(require("./runtime_data/executableFlavorMapByApplication.json"));
const templatesMapByApplication_json_1 = __importDefault(require("./runtime_data/templatesMapByApplication.json"));
class ApplicationStandata extends base_1.Standata {
    static getAppData(appName) {
        const appData = applicationDataMapByApplication_json_1.default;
        if (!(appName in appData)) {
            throw new Error(`${appName} is not a known application with data.`);
        }
        return appData[appName];
    }
    static getAppTree(appName) {
        const executableData = executableFlavorMapByApplication_json_1.default;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        return executableData[appName];
    }
    static getAllAppData() {
        return applicationDataMapByApplication_json_1.default;
    }
    static getAllAppTemplates() {
        return templatesMapByApplication_json_1.default;
    }
    static getAllAppTree() {
        return executableFlavorMapByApplication_json_1.default;
    }
    static getAllApplicationNames() {
        return Object.keys(applicationDataMapByApplication_json_1.default);
    }
    static getTemplatesByName(appName, execName, templateName) {
        const templates = templatesMapByApplication_json_1.default;
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
