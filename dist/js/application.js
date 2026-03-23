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
const TEMPLATES_LIST = templatesList_json_1.default;
const APP_VERSIONS = applicationVersionsMapByApplication_json_1.default;
const EXECUTABLE_FLAVOR = executableFlavorMapByApplication_json_1.default;
var TAGS;
(function (TAGS) {
    TAGS["DEFAULT"] = "default";
    TAGS["DEFAULT_VERSION"] = "default_version";
    TAGS["DEFAULT_BUILD"] = "default_build";
})(TAGS = exports.TAGS || (exports.TAGS = {}));
class ApplicationStandata extends base_1.Standata {
    constructor() {
        super(...arguments);
        this.appCache = {};
    }
    getApplicationExecutablesTree(appName) {
        if (appName in this.appCache) {
            return this.appCache[appName];
        }
        // TODO: Convert to use this.findEntitiesByTags() when tree data is in Standata format
        const executableData = EXECUTABLE_FLAVOR;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        const appTree = executableData[appName];
        this.appCache[appName] = Object.fromEntries(Object.entries(appTree).map(([name, { flavors, ...executable }]) => {
            return [
                name,
                {
                    executable: {
                        preProcessors: [],
                        postProcessors: [],
                        applicationId: [],
                        ...executable,
                        name,
                    },
                    flavors: Object.entries(flavors).map(([name, value]) => {
                        return {
                            preProcessors: [],
                            postProcessors: [],
                            results: [],
                            ...value,
                            name,
                        };
                    }),
                },
            ];
        }));
        return this.appCache[appName];
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
    static getDefaultBuildForApplicationAndVersion(appName, version) {
        var _a;
        const versionConfig = APP_VERSIONS[appName].versions.find((config) => {
            return config.version === version && config.isDefault;
        });
        return (_a = versionConfig === null || versionConfig === void 0 ? void 0 : versionConfig.build) !== null && _a !== void 0 ? _a : null;
    }
    getDefaultConfig() {
        const fullConfig = this.findEntitiesByTags(TAGS.DEFAULT)[0];
        const { name, shortName, version, summary, build } = fullConfig;
        return { name, shortName, version, summary, build };
    }
    buildApplicationsTree() {
        const applicationNames = this.getAllApplicationNames();
        return applicationNames.reduce((tree, appName) => {
            const application = APP_VERSIONS[appName];
            if (!application) {
                throw new Error(`Application ${appName} not found`);
            }
            const { versions, defaultVersion, ...appData } = application;
            return {
                ...tree,
                [appName]: {
                    defaultVersion,
                    versions: versions.reduce((acc, versionInfo) => {
                        return {
                            ...acc,
                            [versionInfo.version]: {
                                ...acc[versionInfo.version],
                                [versionInfo.build]: {
                                    ...appData,
                                    ...versionInfo,
                                },
                            },
                        };
                    }, {}),
                },
            };
        }, {});
    }
    getApplicationsTree() {
        if (this.applicationsTree) {
            return this.applicationsTree;
        }
        this.applicationsTree = this.buildApplicationsTree();
        return this.applicationsTree;
    }
    getApplicationTreeItem(appName) {
        const tree = this.getApplicationsTree();
        const app = tree[appName];
        if (!app) {
            throw new Error(`Application ${appName} not found`);
        }
        return app;
    }
    getApplication({ name, version, build }) {
        const appTreeItem = this.getApplicationTreeItem(name);
        const { defaultVersion } = appTreeItem;
        const appVersion = appTreeItem.versions[version || defaultVersion];
        const application = build
            ? appVersion[build]
            : Object.values(appVersion).find((build) => build.isDefault);
        if (!application) {
            throw new Error(`Application ${name} not found with version ${version} and build ${build}`);
        }
        return application;
    }
    getExecutableByName(appName, execName) {
        const appTree = this.getApplicationExecutablesTree(appName);
        const config = (execName && appTree[execName]) ||
            Object.values(appTree).find((exec) => exec.executable.isDefault);
        if (!config) {
            throw new Error(`Executable ${execName || "default"} not found for application ${appName}`);
        }
        return config;
    }
    getExecutableAndFlavorByName(appName, execName, flavorName) {
        const { executable, flavors } = this.getExecutableByName(appName, execName);
        const flavor = flavors.find((value) => {
            return flavorName ? value.name === flavorName : value.isDefault;
        }) || flavors[0];
        if (!flavor) {
            throw new Error(`Flavor ${flavorName || "default"} not found for executable ${execName} in application ${appName}`);
        }
        return {
            executable,
            flavor,
        };
    }
    getInput(flavor) {
        const appName = flavor.applicationName || "";
        const execName = flavor.executableName || "";
        return flavor.input.map((input) => {
            const inputName = input.templateName || input.name;
            const filtered = this.getTemplatesByName(appName, execName, inputName);
            if (filtered.length !== 1) {
                console.log(`found ${filtered.length} templates for app=${appName} exec=${execName} name=${inputName} expected 1`);
            }
            return { ...filtered[0], name: input.name || "" };
        });
    }
}
exports.ApplicationStandata = ApplicationStandata;
ApplicationStandata.runtimeData = applications_json_1.default;
