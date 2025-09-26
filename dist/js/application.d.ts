import { Standata } from "./base";
import type { ApplicationData, ApplicationExecutableTree, Template } from "./types/application";
export declare class ApplicationStandata extends Standata<ApplicationData> {
    static runtimeData: {
        standataConfig: {
            categories: {
                model: string[];
                language_type: string[];
                purpose: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "espresso/espresso_gnu_63.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                build: string;
                isDefault: boolean;
                hasAdvancedComputeOptions: boolean;
                isLicensed: boolean;
            };
        };
    };
    getAppDataForApplication(appName: string): ApplicationData;
    getAppTreeForApplication(appName: string): ApplicationExecutableTree;
    getAllAppTemplates(): Template[];
    getAllAppTree(): {
        espresso: {
            "pw.x": {
                isDefault: boolean;
                hasAdvancedComputeOptions: boolean;
                postProcessors: string[];
                monitors: string[];
                results: string[];
                flavors: {
                    pw_scf: {
                        isDefault: boolean;
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pw_vc-relax": {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
        };
    };
    getAllApplicationNames(): string[];
    getAllAppData(): ApplicationData[];
    getTemplatesByName(appName: string, execName: string, templateName?: string): Template[];
    getByApplicationName(appName: string): ApplicationData[];
}
