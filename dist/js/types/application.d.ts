import { ApplicationSchemaBase } from "@mat3ra/esse/dist/js/types";
export type ApplicationVersionInfo = Pick<ApplicationSchemaBase, "version" | "isDefault" | "build" | "hasAdvancedComputeOptions">;
export type ApplicationData = Pick<ApplicationSchemaBase, "shortName" | "summary" | "defaultVersion" | "isLicensed"> & {
    versions: ApplicationVersionInfo[];
    name: Required<ApplicationSchemaBase>["name"];
};
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
