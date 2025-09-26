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
            "espresso/espresso_63.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                build: string;
                isDefault: boolean;
                hasAdvancedComputeOptions: boolean;
                isLicensed: boolean;
            };
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
            "espresso/espresso_intel_63.json": {
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
    getAllAppTree(): any;
    getAllApplicationNames(): string[];
    getAllAppData(): any;
    getTemplatesByName(appName: string, execName: string, templateName?: string): Template[];
    getByApplicationName(appName: string): any[];
}
