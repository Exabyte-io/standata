import type { ApplicationSchemaBase, TemplateSchema } from "@mat3ra/esse/dist/js/types";

import { Standata } from "./base";
import APPLICATIONS from "./runtime_data/applications.json";
import APPLICATION_VERSIONS_MAP from "./runtime_data/applicationVersionsMapByApplication.json";
import EXECUTABLE_FLAVOR_MAP from "./runtime_data/executableFlavorMapByApplication.json";
import TEMPLATES_LIST from "./runtime_data/templatesList.json";
import {
    ApplicationExecutableTree,
    ApplicationVersionsMapByApplicationType,
    ApplicationVersionsMapType,
    DefaultApplicationConfig,
} from "./types/application";
import { ApplicationVersionsMap } from "./utils/applicationVersionMap";

export enum TAGS {
    DEFAULT = "default",
    DEFAULT_VERSION = "default_version",
    DEFAULT_BUILD = "default_build",
}

export class ApplicationStandata extends Standata<ApplicationVersionsMapType> {
    static runtimeData = APPLICATIONS;

    // eslint-disable-next-line class-methods-use-this
    getAppDataForApplication(appName: string): ApplicationVersionsMapType {
        const applicationVersionsMap = (
            APPLICATION_VERSIONS_MAP as ApplicationVersionsMapByApplicationType
        )[appName];
        if (!applicationVersionsMap) {
            throw new Error(`Application ${appName} not found`);
        }
        return applicationVersionsMap;
    }

    // eslint-disable-next-line class-methods-use-this
    getAppTreeForApplication(appName: string): ApplicationExecutableTree {
        // TODO: Convert to use this.findEntitiesByTags() when tree data is in Standata format
        const executableData = EXECUTABLE_FLAVOR_MAP as any;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        return executableData[appName] as ApplicationExecutableTree;
    }

    // eslint-disable-next-line class-methods-use-this
    getAllAppTemplates(): TemplateSchema[] {
        // TODO: Convert to use this.getAll() when template data is in Standata format
        return TEMPLATES_LIST as TemplateSchema[];
    }

    // eslint-disable-next-line class-methods-use-this
    getAllAppTree() {
        // TODO: Convert to use this.getAll() when tree data is in Standata format
        return EXECUTABLE_FLAVOR_MAP;
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
        const applicationVersionsMap = new ApplicationVersionsMap(
            (APPLICATION_VERSIONS_MAP as ApplicationVersionsMapByApplicationType)[appName],
        );
        return applicationVersionsMap.defaultVersion;
    }

    static getDefaultBuildForApplicationAndVersion(appName: string, version: string): string {
        const applicationVersionsMap = new ApplicationVersionsMap(
            (APPLICATION_VERSIONS_MAP as ApplicationVersionsMapByApplicationType)[appName],
        );
        const versionConfig = applicationVersionsMap.versionConfigs.find(
            (config) => config.version === version && config.isDefault,
        );
        if (!versionConfig) {
            throw new Error(`No default build found for ${appName} with version ${version}`);
        }
        if (!versionConfig.build) {
            throw new Error(
                `No build specified for default config of ${appName} with version ${version}`,
            );
        }
        return versionConfig.build;
    }

    // TODO: move to parent class Standata, name and generic parameters
    getDefaultConfigByNameAndVersion(
        appName: string,
        version?: string,
    ): ApplicationVersionsMapType {
        const tags = [TAGS.DEFAULT_BUILD];
        let versionToUse = version;
        if (!versionToUse) {
            tags.push(TAGS.DEFAULT_VERSION);
            versionToUse = ApplicationStandata.getDefaultVersionForApplication(appName);
        }
        const allEntriesWithTags = this.findEntitiesByTags(...tags);
        const allEntriesWithTagsForNameAndVersion = allEntriesWithTags.filter((entity: any) => {
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

    getDefaultConfig(): DefaultApplicationConfig {
        const fullConfig = this.findEntitiesByTags(TAGS.DEFAULT)[0];
        const { name, shortName, version, summary, build } = fullConfig as ApplicationSchemaBase;
        return { name, shortName, version, summary, build };
    }
}
