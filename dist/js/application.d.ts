import type { ApplicationSchema, ExecutableSchema, FlavorSchema, TemplateSchema } from "@mat3ra/esse/dist/js/types";
import { Standata } from "./base";
export declare enum TAGS {
    DEFAULT = "default",
    DEFAULT_VERSION = "default_version",
    DEFAULT_BUILD = "default_build"
}
export type ApplicationConfig = {
    name: string;
    version?: string;
    build?: string;
};
type AppConfig = {
    appName: string;
    appVersion?: string;
};
type ExecutableConfig = AppConfig & {
    execName?: string;
};
type FlavorConfig = ExecutableConfig & {
    flavorName?: string;
};
export declare class ApplicationStandata extends Standata<ApplicationSchema> {
    static runtimeData: {
        filesMapByName: {
            "espresso/espresso_gnu_6.3.json": {
                build: string;
                buildConfig: {
                    bio: string;
                    dependencies: string[];
                    environmentVariables: {};
                    imageName: string;
                    imageTag: string;
                    moduleName: string;
                };
                hasAdvancedComputeOptions: boolean;
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "nwchem/nwchem_gnu_7.0.2.json": {
                build: string;
                buildConfig: {
                    bio: string;
                    dependencies: string[];
                    environmentVariables: {
                        APPTAINERENV_NWCHEM_BASIS_LIBRARY: string;
                        NWCHEMRC_PATH: string;
                    };
                    imageName: string;
                    imageTag: string;
                    moduleName: string;
                };
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "python/python_gnu_3.10.13.json": {
                build: string;
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "shell/shell_gnu_5.1.8.json": {
                build: string;
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "vasp/vasp_gnu_5.4.4.json": {
                build: string;
                buildConfig: {
                    bio: string;
                    dependencies: string[];
                    environmentVariables: {};
                    imageName: string;
                    imageTag: string;
                    moduleName: string;
                };
                isDefault: boolean;
                isLicensed: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
        };
        standataConfig: {
            categories: {
                defaults: string[];
                language_type: string[];
                model: string[];
                purpose: string[];
            };
            entities: {
                categories: string[];
                filename: string;
            }[];
        };
    };
    private appExecutablesCache;
    private getAllApplicationNames;
    getAllAppData(): ApplicationSchema[];
    getByApplicationName(appName: string): ApplicationSchema[];
    static getDefaultBuildForApplicationAndVersion(appName: string, version: string): string | null;
    getDefaultConfig(): {
        name: string;
        shortName: string;
        version: string;
        summary: string;
        build: string;
    };
    private applicationsTree?;
    private buildApplicationsTree;
    private getApplicationsTree;
    getApplication({ name, version, build }: ApplicationConfig): ApplicationSchema;
    private getApplicationExecutablesTree;
    getExecutablesByApplicationName({ appName, appVersion }: AppConfig): {
        executable: ExecutableSchema;
        flavors: {
            flavor: FlavorSchema;
            supportedApplicationVersions?: string[] | undefined;
        }[];
        supportedApplicationVersions?: string[] | undefined;
    }[];
    getExecutableByName({ appName, appVersion, execName }: ExecutableConfig): {
        executable: ExecutableSchema;
        flavors: {
            flavor: FlavorSchema;
            supportedApplicationVersions?: string[] | undefined;
        }[];
    };
    getExecutableAndFlavorByName({ appName, appVersion, execName, flavorName }: FlavorConfig): {
        executable: ExecutableSchema;
        flavor: FlavorSchema;
    };
    getTemplatesByName(appName: string, execName: string, templateName?: string): TemplateSchema[];
    getInput(flavor: FlavorSchema): TemplateSchema[];
}
export {};
