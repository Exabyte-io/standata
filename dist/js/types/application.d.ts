export interface ApplicationVersionInfo {
    version: string;
    isDefault?: boolean;
    build?: string;
    hasAdvancedComputeOptions?: boolean;
}
export interface ApplicationData {
    name: string;
    shortName: string;
    summary: string;
    defaultVersion: string;
    isLicensed?: boolean;
    versions: ApplicationVersionInfo[];
}
export interface ApplicationTreeItem {
    supportedApplicationVersions?: string[];
    name: string;
    isDefault?: boolean;
}
export interface ExecutableTreeItem {
    name?: string;
    isDefault?: boolean;
    supportedApplicationVersions?: string[];
    flavors?: Record<string, any>;
    [key: string]: any;
}
export type ApplicationExecutableTree = Record<string, ExecutableTreeItem>;
export interface Template {
    applicationName: string;
    executableName: string;
    name: string;
    content: string;
}
