import { ApplicationSchema, ExecutableSchema, FlavorSchema } from "@mat3ra/esse/dist/js/types";

type OptionalExecutableSchema = Partial<ExecutableSchema>;

export type ApplicationVersionInfo = Pick<
    ApplicationSchema,
    "isDefault" | "build" | "hasAdvancedComputeOptions" | "version"
>;

export type ApplicationVersionsMapType = Pick<
    ApplicationSchema,
    "name" | "shortName" | "summary" | "isLicensed"
> & {
    // TODO: defaultVersion should come from ESSE
    defaultVersion: string;
    versions: ApplicationVersionInfo[];
};

export type ApplicationVersionsMapByApplicationType = {
    [key: string]: ApplicationVersionsMapType;
};

type OptionalFlavorSchema = Partial<FlavorSchema>;

type Flavor = Pick<FlavorSchema, "input" | "monitors" | "applicationName" | "executableName"> &
    Pick<OptionalFlavorSchema, "results">;

export type ExecutableTreeItem = Pick<
    ExecutableSchema,
    "hasAdvancedComputeOptions" | "isDefault" | "monitors" | "results"
> &
    Pick<OptionalExecutableSchema, "postProcessors"> & {
        supportedApplicationVersions?: ApplicationSchema["version"][];
        flavors?: Record<string, Flavor>;
        [key: string]: any;
    };

export type ApplicationExecutableTree = Record<string, Record<string, ExecutableTreeItem>>;
