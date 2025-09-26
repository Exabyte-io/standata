import { Standata } from "./base";
import APPLICATIONS from "./runtime_data/applications.json";
import EXECUTABLE_FLAVOR_MAP from "./runtime_data/executableFlavorMapByApplication.json";
import TEMPLATES_LIST from "./runtime_data/templatesList.json";
import type { ApplicationData, ApplicationExecutableTree, Template } from "./types/application";

export class ApplicationStandata extends Standata {
    static runtimeData = APPLICATIONS;

    getAppDataForApplication(appName: string): ApplicationData {
        const appEntities = this.findEntitiesByTags(appName);
        if (appEntities.length === 0) {
            throw new Error(`${appName} is not a known application with data.`);
        }
        return appEntities[0] as ApplicationData;
    }

    static getAppTreeForApplication(appName: string): ApplicationExecutableTree {
        const executableData = EXECUTABLE_FLAVOR_MAP as any;
        if (!(appName in executableData)) {
            throw new Error(`${appName} is not a known application with executable tree.`);
        }
        return executableData[appName] as ApplicationExecutableTree;
    }

    static getAllAppTemplates(): Template[] {
        return TEMPLATES_LIST as Template[];
    }

    static getAllAppTree(): any {
        return EXECUTABLE_FLAVOR_MAP;
    }

    getAllApplicationNames(): string[] {
        const allApps = this.getAll();
        const uniqueNames = new Set(allApps.map((app: any) => app.name));
        return Array.from(uniqueNames);
    }

    getAllAppData(): any {
        return this.getAll();
    }

    static getTemplatesByName(
        appName: string,
        execName: string,
        templateName?: string,
    ): Template[] {
        const templates = TEMPLATES_LIST as Template[];
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
