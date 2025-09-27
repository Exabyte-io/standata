import { ApplicationSchemaBase, ExecutableSchema } from "@mat3ra/esse/dist/js/types";

import { ApplicationExecutableTree } from "./application";

export type FilterTree = ApplicationExecutableTree;

export interface FilterObjectPath {
    path: string;
}

export interface FilterObjectRegex {
    regex: string;
}

export type FilterObject = FilterObjectPath | FilterObjectRegex;

export interface FilterObjectsParams
    extends Partial<Pick<ApplicationSchemaBase, "name" | "version" | "build">> {
    filterTree: FilterTree;
    executable?: ExecutableSchema["name"];
    flavor?: string;
}

export interface FilterableEntity {
    path: string;
    [key: string]: any;
}

export interface FilterEntityListParams {
    entitiesOrPaths: (string | FilterableEntity)[];
    filterObjects: FilterObject[];
}

export interface ApplicationModelParametersInterface
    extends Omit<FilterObjectsParams, "filterTree"> {
    modelList: any[];
    name: Required<ApplicationSchemaBase>["name"];
}

export type ModelMethodFilterTree = Record<
    Required<ApplicationSchemaBase>["name"],
    Record<
        Required<ApplicationSchemaBase>["version"],
        Record<
            Required<ApplicationSchemaBase>["build"],
            Record<ExecutableSchema["name"], Record<string, FilterObject[]>>
        >
    >
>;

export interface ModelMethodMapByApplication {
    models: ModelMethodFilterTree;
    methods: ModelMethodFilterTree;
}

export interface ApplicationMethodParametersInterface
    extends Omit<FilterObjectsParams, "filterTree"> {
    methodList: any[];
    name: Required<ApplicationSchemaBase>["name"];
}
