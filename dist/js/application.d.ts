import { Standata } from "./base";
import type { ApplicationData, ApplicationExecutableTree, Template } from "./types/application";
export declare class ApplicationStandata extends Standata {
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
            "espresso_gnu_540.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                build: string;
                hasAdvancedComputeOptions: boolean;
                isLicensed: boolean;
            };
            "python_386.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                build: string;
                hasAdvancedComputeOptions: boolean;
                isLicensed: boolean;
            };
        };
    };
    static getAppDataForApplication(appName: string): ApplicationData;
    static getAppTreeForApplication(appName: string): ApplicationExecutableTree;
    static getAllAppData(): any;
    static getAllAppTemplates(): Template[];
    static getAllAppTree(): any;
    static getAllApplicationNames(): string[];
    static getTemplatesByName(appName: string, execName: string, templateName?: string): Template[];
    getByApplicationName(appName: string): any[];
}
