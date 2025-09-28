import type { TemplateSchema } from "@mat3ra/esse/dist/js/types";
import { Standata } from "./base";
import type { ApplicationExecutableTree, ApplicationVersionsMapType } from "./types/application";
export declare class ApplicationStandata extends Standata<ApplicationVersionsMapType> {
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
            "espresso/espresso_gnu_6.3.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                isDefault: boolean;
                build: string;
                hasAdvancedComputeOptions: boolean;
            };
        };
    };
    getAppDataForApplication(appName: string): ApplicationVersionsMapType;
    getAppTreeForApplication(appName: string): ApplicationExecutableTree;
    getAllAppTemplates(): TemplateSchema[];
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
    getAllAppData(): ApplicationVersionsMapType[];
    getTemplatesByName(appName: string, execName: string, templateName?: string): TemplateSchema[];
    getByApplicationName(appName: string): ApplicationVersionsMapType[];
}
