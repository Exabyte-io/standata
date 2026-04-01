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
        this.appExecutablesCache = {};
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
    getApplication({ name, version, build }) {
        const tree = this.getApplicationsTree();
        const appTreeItem = tree[name];
        if (!appTreeItem) {
            throw new Error(`Application ${name} not found`);
        }
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
    // EXECUTABLE_FLAVOR
    getApplicationExecutablesTree(appName) {
        if (appName in this.appExecutablesCache) {
            return this.appExecutablesCache[appName];
        }
        // TODO: Convert to use this.findEntitiesByTags() when tree data is in Standata format
        const executableData = EXECUTABLE_FLAVOR;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        const appTree = executableData[appName];
        this.appExecutablesCache[appName] = Object.fromEntries(Object.entries(appTree).map(([name, { supportedApplicationVersions, flavors, ...executable }]) => {
            return [
                name,
                {
                    executable: {
                        preProcessors: [],
                        postProcessors: [],
                        applicationId: [],
                        ...executable,
                        applicationName: appName,
                        name,
                    },
                    flavors: Object.entries(flavors).map(([name, { supportedApplicationVersions, ...flavor }]) => {
                        return {
                            flavor: {
                                preProcessors: [],
                                postProcessors: [],
                                results: [],
                                ...flavor,
                                name,
                            },
                            supportedApplicationVersions,
                        };
                    }),
                    supportedApplicationVersions,
                },
            ];
        }));
        return this.appExecutablesCache[appName];
    }
    getExecutablesByApplicationName({ appName, appVersion }) {
        const appTree = this.getApplicationExecutablesTree(appName);
        return Object.values(appTree).filter((data) => {
            return appVersion && data.supportedApplicationVersions
                ? data.supportedApplicationVersions.includes(appVersion)
                : true;
        });
    }
    getExecutableByName({ appName, appVersion, execName }) {
        const config = this.getExecutablesByApplicationName({
            appName,
            appVersion,
        }).find((data) => {
            return execName ? data.executable.name === execName : data.executable.isDefault;
        });
        if (!config) {
            throw new Error(`Executable ${execName || "default"} not found for application ${appName} version ${appVersion || "-any-"}`);
        }
        return {
            executable: config.executable,
            flavors: config.flavors,
        };
    }
    getExecutableAndFlavorByName({ appName, appVersion, execName, flavorName }) {
        const { executable, flavors } = this.getExecutableByName({
            appName,
            appVersion,
            execName,
        });
        const flavor = flavors.find((value) => {
            return flavorName ? value.flavor.name === flavorName : value.flavor.isDefault;
        }) || flavors[0];
        if (!flavor) {
            throw new Error(`Flavor ${flavorName || "default"} not found for executable ${execName} in application ${appName}`);
        }
        return {
            executable,
            flavor: flavor.flavor,
        };
    }
    // TEMPLATES_LIST
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
