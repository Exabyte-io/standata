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
    type FlavorConfig,
    ApplicationExecutableTree,
    ApplicationVersionsMapByApplicationType,
} from "./types/application";

const TEMPLATES_LIST = TEMPLATES_LIST_RAW as TemplateSchema[];
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

export class ApplicationStandata extends Standata<ApplicationSchema> {
    static runtimeData = APPLICATIONS;

    private appCache: Record<
        string,
        Record<
            string,
            {
                executable: ExecutableSchema;
                flavors: FlavorSchema[];
            }
        >
    > = {};

    private getAppDataForApplication(appName: string) {
        const applicationVersionsMap = APP_VERSIONS[appName];

        if (!applicationVersionsMap) {
            throw new Error(`Application ${appName} not found`);
        }
        return applicationVersionsMap;
    }

    private getApplicationExecutablesTree(appName: string) {
        if (appName in this.appCache) {
            return this.appCache[appName];
        }

        // TODO: Convert to use this.findEntitiesByTags() when tree data is in Standata format
        const executableData = EXECUTABLE_FLAVOR;

        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }

        const appTree = executableData[appName];

        this.appCache[appName] = Object.fromEntries(
            Object.entries(appTree).map(([name, { flavors, ...executable }]) => {
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
            }),
        );

        return this.appCache[appName];
    }

    getAllAppTemplates(): TemplateSchema[] {
        // TODO: Convert to use this.getAll() when template data is in Standata format
        return TEMPLATES_LIST;
    }

    getAllAppTree() {
        // TODO: Convert to use this.getAll() when tree data is in Standata format
        return EXECUTABLE_FLAVOR_MAP;
    }

    // TODO: move to parent class Standata
    private getAllApplicationNames() {
        const allApps = this.getAll();
        const uniqueNames = new Set(allApps.map((app) => app.name));
        return Array.from(uniqueNames);
    }

    // TODO: move to parent class Standata
    getAllAppData() {
        return this.getAll();
    }

    getTemplatesByName(appName: string, execName: string, templateName?: string): TemplateSchema[] {
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
    getByApplicationName(appName: string) {
        const allEntities = this.getAll();
        return allEntities.filter((entity) => entity.name === appName);
    }

    static getDefaultVersionForApplication(appName: string) {
        return APP_VERSIONS[appName].defaultVersion;
    }

    static getDefaultBuildForApplicationAndVersion(appName: string, version: string) {
        const versionConfig = APP_VERSIONS[appName].versions.find((config) => {
            return config.version === version && config.isDefault;
        });
        return versionConfig?.build ?? null;
    }

    // TODO: move to parent class Standata, name and generic parameters
    getDefaultConfigByNameAndVersion(appName: string, version?: string) {
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
            throw new Error(
                `Multiple default version entries found for ${appName} with version ${versionToUse}`,
            );
        } else if (allEntriesWithTagsForNameAndVersion.length === 0) {
            throw new Error(
                `No default version entry found for ${appName} with version ${versionToUse}`,
            );
        }
        return allEntriesWithTagsForNameAndVersion[0];
    }

    getDefaultConfig() {
        const fullConfig = this.findEntitiesByTags(TAGS.DEFAULT)[0];
        const { name, shortName, version, summary, build } = fullConfig;
        return { name, shortName, version, summary, build };
    }

    private applicationsTree?: ApplicationTree;

    private applications?: ApplicationSchema[];

    public getApplicationsTree() {
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

        return this.applicationsTree;
    }

    public getApplications() {
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

    public getApplicationTreeItem(appName: string) {
        const tree = this.getApplicationsTree();
        const app = tree[appName];

        if (!app) {
            throw new Error(`Application ${appName} not found`);
        }

        return app;
    }

    public getApplication({ name, version, build }: ApplicationConfig) {
        const appTreeItem = this.getApplicationTreeItem(name);
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

    getExecutableByName(appName: string, execName?: string) {
        const appTree = this.getApplicationExecutablesTree(appName);

        const config =
            (execName && appTree[execName]) ||
            Object.values(appTree).find((exec) => exec.executable.isDefault);

        if (!config) {
            throw new Error(`Executable ${execName} not found for application ${appName}`);
        }

        return config.executable;
    }

    getExecutableAndFlavorByName(
        appName: string,
        execName?: string,
        flavorName?: string,
    ): {
        executable: ExecutableSchema;
        flavor: FlavorSchema;
    } {
        const appTree = this.getApplicationExecutablesTree(appName);
        const config =
            (execName && appTree[execName]) ||
            Object.values(appTree).find((exec) => exec.executable.isDefault);

        if (!config) {
            throw new Error(`Executable ${execName} not found for application ${appName}`);
        }

        const { executable, flavors } = config;

        const flavor = flavors.find((value) => {
            return flavorName ? value.name === flavorName : value.isDefault;
        });

        if (!flavor) {
            throw new Error(
                `Flavor ${flavorName} not found for executable ${execName} in application ${appName}`,
            );
        }

        return {
            executable,
            flavor,
        };
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
