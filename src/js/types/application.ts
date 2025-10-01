import { ApplicationSchemaBase, ExecutableSchema } from "@mat3ra/esse/dist/js/types";

export type ApplicationVersionInfo = Pick<
    ApplicationSchemaBase,
    "isDefault" | "build" | "hasAdvancedComputeOptions"
> & {
    version: Required<ApplicationSchemaBase>["version"];
};

export type DefaultApplicationConfig = Pick<
    ApplicationSchemaBase,
    "name" | "shortName" | "version" | "summary" | "build"
>;

export type ApplicationVersionsMapType = Pick<
    ApplicationSchemaBase,
    "shortName" | "summary" | "isLicensed"
> & {
    // TODO: defaultVersion should come from ESSE
    defaultVersion: string;
    versions: ApplicationVersionInfo[];
    name: Required<ApplicationSchemaBase>["name"];
};

export type ApplicationVersionsMapByApplicationType = {
    [key: string]: ApplicationVersionsMapType;
};

export interface ExecutableTreeItem
    extends Pick<ExecutableSchema, "name" | "hasAdvancedComputeOptions"> {
    isDefault?: ApplicationSchemaBase["isDefault"];
    supportedApplicationVersions?: ApplicationSchemaBase["version"][];
    flavors?: Record<string, any>;
    [key: string]: any;
}

export type ApplicationExecutableTree = Record<string, ExecutableTreeItem>;
