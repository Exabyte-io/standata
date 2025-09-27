import { ApplicationSchemaBase, ExecutableSchema } from "@mat3ra/esse/dist/js/types";
export type ApplicationVersionInfo = Pick<ApplicationSchemaBase, "isDefault" | "build" | "hasAdvancedComputeOptions"> & {
    version: Required<ApplicationSchemaBase>["version"];
};
export type ApplicationData = Pick<ApplicationSchemaBase, "shortName" | "summary" | "isLicensed"> & {
    defaultVersion: string;
    versions: ApplicationVersionInfo[];
    name: Required<ApplicationSchemaBase>["name"];
};
export interface ApplicationTreeItem extends Pick<ApplicationSchemaBase, "name" | "isDefault"> {
    supportedApplicationVersions?: ApplicationSchemaBase["version"][];
}
export interface ExecutableTreeItem extends Pick<ExecutableSchema, "name" | "hasAdvancedComputeOptions"> {
    isDefault?: ApplicationSchemaBase["isDefault"];
    supportedApplicationVersions?: ApplicationSchemaBase["version"][];
    flavors?: Record<string, any>;
    [key: string]: any;
}
export type ApplicationExecutableTree = Record<string, ExecutableTreeItem>;
