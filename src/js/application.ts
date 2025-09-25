import { Standata } from "./base";
import APPLICATION_DATA_MAP from "./runtime_data/applicationDataMapByApplication.json";
import APPLICATIONS from "./runtime_data/applications.json";
import EXECUTABLE_FLAVOR_MAP from "./runtime_data/executableFlavorMapByApplication.json";
import TEMPLATES_MAP from "./runtime_data/templatesMapByApplication.json";
import type {
    ApplicationData,
    ApplicationExecutableTree,
    ApplicationName,
    Template,
} from "./types/application";

export class ApplicationStandata extends Standata {
    static runtimeData = APPLICATIONS;

    static getAppData(appName: ApplicationName): ApplicationData {
        const appData = APPLICATION_DATA_MAP as any;
        if (!(appName in appData)) {
            throw new Error(`${appName} is not a known application with data.`);
        }
        return appData[appName];
    }

    static getAppTree(appName: ApplicationName): ApplicationExecutableTree {
        const executableData = EXECUTABLE_FLAVOR_MAP as any;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        return executableData[appName] as ApplicationExecutableTree;
    }

    static getAllAppData(): any {
        return APPLICATION_DATA_MAP;
    }

    static getAllAppTemplates(): Template[] {
        return TEMPLATES_MAP as Template[];
    }

    static getAllAppTree(): any {
        return EXECUTABLE_FLAVOR_MAP;
    }

    static getAllApplicationNames(): ApplicationName[] {
        return Object.keys(APPLICATION_DATA_MAP) as ApplicationName[];
    }

    static getTemplatesByName(
        appName: ApplicationName,
        execName: string,
        templateName?: string,
    ): Template[] {
        const templates = TEMPLATES_MAP as Template[];
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

    getByApplicationName(appName: string): any[] {
        return this.findEntitiesByTags(appName);
    }
}
