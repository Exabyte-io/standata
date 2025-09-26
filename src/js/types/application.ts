import { ApplicationSchemaBase } from "@mat3ra/esse/dist/js/types";

export type ApplicationVersionInfo = Pick<
    ApplicationSchemaBase,
    "isDefault" | "build" | "hasAdvancedComputeOptions"
> & {
    version: Required<ApplicationSchemaBase>["version"];
};

export type ApplicationData = Pick<
    ApplicationSchemaBase,
    "shortName" | "summary" | "isLicensed"
> & {
    // TODO: defaultVersion should come from ESSE
    defaultVersion: string;
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
