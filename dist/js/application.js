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
        const appTree = executableData[appName];
        return Object.fromEntries(Object.entries(appTree).map(([name, exec]) => {
            return [
                name,
                {
                    preProcessors: [],
                    postProcessors: [],
                    applicationId: [],
                    ...exec,
                    name,
                },
            ];
        }));
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
        return APP_VERSIONS[appName].defaultVersion;
    }
    static getDefaultBuildForApplicationAndVersion(appName, version) {
        var _a;
        const versionConfig = APP_VERSIONS[appName].versions.find((config) => {
            return config.version === version && config.isDefault;
        });
        return (_a = versionConfig === null || versionConfig === void 0 ? void 0 : versionConfig.build) !== null && _a !== void 0 ? _a : null;
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
    getApplicationsTree() {
        if (this.applicationsTree) {
            return this.applicationsTree;
        }
        const applicationNames = this.getAllApplicationNames();
        this.applicationsTree = applicationNames.reduce((tree, appName) => {
            const { versions, defaultVersion, ...appData } = this.getAppDataForApplication(appName);
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
        return this.applicationsTree;
    }
    getApplications() {
        if (this.applications) {
            return this.applications;
        }
        const tree = this.getApplicationsTree();
        this.applications = Object.values(tree).flatMap((appTreeItem) => {
            return Object.values(appTreeItem.versions).flatMap((version) => {
                return Object.values(version).flat();
            });
        });
        return this.applications;
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
        const appTree = this.getAppTreeForApplication(appName);
        const config = execName && appTree[execName]
            ? appTree[execName]
            : Object.values(appTree).find((exec) => exec.isDefault);
        if (!config) {
            throw new Error(`Executable ${execName} not found for application ${appName}`);
        }
        return config;
    }
    /**
     *
     * @deprecated use getExecutableByName directly
     */
    getExecutableByConfig(appName, config) {
        return this.getExecutableByName(appName, config === null || config === void 0 ? void 0 : config.name);
    }
    getExecutableAndFlavorByName(appName, execName, flavorName) {
        const executable = this.getExecutableByName(appName, execName);
        const flavor = this.getFlavorByName(executable, flavorName);
        if (!flavor) {
            throw new Error(`Flavor ${flavorName} not found for executable ${execName} in application ${appName}`);
        }
        return { executable, flavor };
    }
    getFlavorByName(executable, name) {
        return this.getExecutableFlavors(executable).find((flavor) => name ? flavor.name === name : flavor.isDefault);
    }
    /**
     * @deprecated use getFlavorByName directly
     */
    getFlavorByConfig(executable, config) {
        return this.getFlavorByName(executable, config === null || config === void 0 ? void 0 : config.name);
    }
    getExecutableFlavors(executable) {
        return Object.entries(executable.flavors).map(([key, value]) => {
            return {
                preProcessors: [],
                postProcessors: [],
                results: [],
                ...value,
                name: key,
            };
        });
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
