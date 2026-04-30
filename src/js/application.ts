/* eslint-disable class-methods-use-this */
import type {
    ApplicationSchema,
    ExecutableSchema,
    FlavorSchema,
    TemplateSchema,
} from "@mat3ra/esse/dist/js/types";

import { Standata } from "./base";
import APPLICATIONS from "./runtime_data/applications.json";
import APPLICATION_VERSIONS_MAP from "./runtime_data/applications/applicationVersionsMapByApplication.json";
import EXECUTABLE_FLAVOR_MAP from "./runtime_data/applications/executableFlavorMapByApplication.json";
import TEMPLATES_LIST_RAW from "./runtime_data/applications/templatesList.json";
import {
    type TemplateConfigItem,
    ApplicationExecutableTree,
    ApplicationVersionsMapByApplicationType,
} from "./types/application";

const TEMPLATES_LIST = TEMPLATES_LIST_RAW as TemplateConfigItem[];
const APP_VERSIONS = APPLICATION_VERSIONS_MAP as ApplicationVersionsMapByApplicationType;
const EXECUTABLE_FLAVOR = EXECUTABLE_FLAVOR_MAP as ApplicationExecutableTree;

export enum TAGS {
    DEFAULT = "default",
    DEFAULT_VERSION = "default_version",
    DEFAULT_BUILD = "default_build",
}

export type ApplicationConfig = {
    name: string;
    version?: string;
    build?: string;
};

type ApplicationVersion = {
    [build: string]: ApplicationSchema;
};

type ApplicationTreeItem = {
    defaultVersion: string;
    versions: {
        [version: string]: ApplicationVersion;
    };
};

type ApplicationTree = Record<string, ApplicationTreeItem>;

type AppConfig = { appName: string; appVersion?: string };
type ExecutableConfig = AppConfig & { execName?: string };
type FlavorConfig = ExecutableConfig & { flavorName?: string };

export class ApplicationStandata extends Standata<ApplicationSchema> {
    static runtimeData = APPLICATIONS;

    private appExecutablesCache: Record<
        string,
        Record<
            string,
            {
                executable: ExecutableSchema;
                flavors: {
                    flavor: FlavorSchema;
                    supportedApplicationVersions?: string[];
                }[];
                supportedApplicationVersions?: string[];
            }
        >
    > = {};

    private applicationsTree?: ApplicationTree;

    private buildApplicationsTree() {
        const applicationNames = [...new Set(this.getAll().map((app) => app.name))];

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
                    versions: versions.reduce<ApplicationTreeItem["versions"]>(
                        (acc, versionInfo) => {
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
                        },
                        {},
                    ),
                },
            };
        }, {});
    }

    private getApplicationsTree() {
        if (this.applicationsTree) {
            return this.applicationsTree;
        }

        this.applicationsTree = this.buildApplicationsTree();

        return this.applicationsTree;
    }

    public getDefaultConfig() {
        const fullConfig = this.findEntitiesByTags(TAGS.DEFAULT)[0];
        const { name, shortName, version, summary, build } = fullConfig;
        return { name, shortName, version, summary, build };
    }

    public getAllApplications() {
        const tree = this.getApplicationsTree();
        return Object.values(tree)
            .flatMap((item) => Object.values(item.versions))
            .flatMap((version) => Object.values(version));
    }

    public getApplication({ name, version, build }: ApplicationConfig) {
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
            throw new Error(
                `Application ${name} not found with version ${version} and build ${build}`,
            );
        }

        return application;
    }

    // EXECUTABLE_FLAVOR

    private getApplicationExecutablesTree(appName: string) {
        if (appName in this.appExecutablesCache) {
            return this.appExecutablesCache[appName];
        }

        // TODO: Convert to use this.findEntitiesByTags() when tree data is in Standata format
        const executableData = EXECUTABLE_FLAVOR;

        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }

        const appTree = executableData[appName];

        this.appExecutablesCache[appName] = Object.fromEntries(
            Object.entries(appTree).map(
                ([name, { supportedApplicationVersions, flavors, ...executable }]) => {
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
                            flavors: Object.entries(flavors).map(
                                ([name, { supportedApplicationVersions, ...flavor }]) => {
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
                                },
                            ),
                            supportedApplicationVersions,
                        },
                    ];
                },
            ),
        );

        return this.appExecutablesCache[appName];
    }

    getExecutablesByApplicationName({ appName, appVersion }: AppConfig) {
        const appTree = this.getApplicationExecutablesTree(appName);

        return Object.values(appTree).filter((data) => {
            return appVersion && data.supportedApplicationVersions
                ? data.supportedApplicationVersions.includes(appVersion)
                : true;
        });
    }

    getExecutableByName({ appName, appVersion, execName }: ExecutableConfig) {
        const config = this.getExecutablesByApplicationName({
            appName,
            appVersion,
        }).find((data) => {
            return execName ? data.executable.name === execName : data.executable.isDefault;
        });

        if (!config) {
            throw new Error(
                `Executable ${execName || "default"} not found for application ${appName} version ${
                    appVersion || "-any-"
                }`,
            );
        }

        return {
            executable: config.executable,
            flavors: config.flavors,
        };
    }

    getExecutableAndFlavorByName({ appName, appVersion, execName, flavorName }: FlavorConfig) {
        const { executable, flavors } = this.getExecutableByName({
            appName,
            appVersion,
            execName,
        });

        const flavor =
            flavors.find((value) => {
                return flavorName ? value.flavor.name === flavorName : value.flavor.isDefault;
            }) || flavors[0];

        if (!flavor) {
            throw new Error(
                `Flavor ${
                    flavorName || "default"
                } not found for executable ${execName} in application ${appName}`,
            );
        }

        return {
            executable,
            flavor: flavor.flavor,
        };
    }

    // TEMPLATES_LIST
    getAllAppTemplates() {
        return TEMPLATES_LIST;
    }

    getTemplatesByName(appName: string, execName: string, templateName?: string): TemplateSchema[] {
        const filtered = this.getAllAppTemplates().filter((template) => {
            const matchesApp = template.applicationName === appName;
            const matchesExec = template.executableName === execName;
            return matchesApp && matchesExec;
        });

        if (!templateName) {
            return filtered;
        }

        return filtered.filter((template) => template.name === templateName);
    }

    getInput(flavor: FlavorSchema): TemplateSchema[] {
        const appName = flavor.applicationName || "";
        const execName = flavor.executableName || "";

        return flavor.input.map((input): TemplateSchema => {
            const inputName = input.templateName || input.name;
            const filtered = this.getTemplatesByName(appName, execName, inputName);

            if (filtered.length !== 1) {
                console.log(
                    `found ${filtered.length} templates for app=${appName} exec=${execName} name=${inputName} expected 1`,
                );
            }

            return { ...filtered[0], name: input.name || "" };
        });
    }
}
