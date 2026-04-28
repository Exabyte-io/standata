import { ApplicationSchema, ExecutableSchema, FlavorSchema } from "@mat3ra/esse/dist/js/types";

type VersionFields = "isDefault" | "build" | "hasAdvancedComputeOptions" | "version";
type ApplicationFields = "name" | "shortName" | "summary" | "isLicensed";

export type ApplicationVersion = Pick<ApplicationSchema, VersionFields>;

export type ApplicationConfigItem = Pick<ApplicationSchema, ApplicationFields> & {
    // TODO: defaultVersion should come from ESSE
    defaultVersion: string;
    versions: ApplicationVersion[];
};

export type ApplicationVersionsMapByApplicationType = {
    [key: string]: ApplicationConfigItem;
};

type OptionalFlavorSchema = Partial<FlavorSchema>;
type RequiredFlavorFields =
    | "input"
    | "monitors"
    | "applicationName"
    | "executableName"
    | "isDefault";
type OptionalFlavorFields = "results";

export type FlavorConfig = Pick<FlavorSchema, RequiredFlavorFields> &
    Pick<OptionalFlavorSchema, OptionalFlavorFields> & {
        supportedApplicationVersions?: string[];
    };

type OptionalExecutableSchema = Partial<ExecutableSchema>;
type RequiredExecutableFields = "hasAdvancedComputeOptions" | "isDefault" | "monitors" | "results";
type OptionalExecutableFields = "postProcessors";

export type ExecutableTreeItem = Pick<ExecutableSchema, RequiredExecutableFields> &
    Pick<OptionalExecutableSchema, OptionalExecutableFields> & {
        flavors: Record<string, FlavorConfig>;
        supportedApplicationVersions?: string[];
    };

export type ApplicationExecutableTree = Record<string, Record<string, ExecutableTreeItem>>;
