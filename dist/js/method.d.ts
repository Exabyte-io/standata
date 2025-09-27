import { Standata } from "./base";
export interface MethodUnit {
    name: string;
    path: string;
    categories: {
        tier1?: string;
        tier2?: string;
        tier3?: string;
        type: string;
        subtype?: string;
    };
    parameters?: Record<string, any>;
    tags: string[];
}
export interface MethodConfig {
    name: string;
    path: string;
    units: MethodUnit[];
}
export declare class MethodStandata extends Standata<MethodConfig> {
    static runtimeData: {
        standataConfig: {
            categories: {
                tier1: string[];
                tier2: string[];
                tier3: string[];
                type: string[];
                subtype: string[];
                tags: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "psp/ultrasoft_pseudopotential.json": {
                name: string;
                path: string;
                categories: {
                    subtype: string;
                    tier1: string;
                    tier2: string;
                    type: string;
                };
                tags: string[];
                units: {
                    name: string;
                    path: string;
                    categories: {
                        subtype: string;
                        tier1: string;
                        tier2: string;
                        type: string;
                    };
                    tags: string[];
                }[];
            };
            "pw/plane_wave.json": {
                name: string;
                path: string;
                categories: {
                    tier1: string;
                    tier2: string;
                    type: string;
                };
                tags: string[];
                units: {
                    name: string;
                    path: string;
                    categories: {
                        tier1: string;
                        tier2: string;
                        type: string;
                    };
                    tags: string[];
                }[];
            };
            "linear/least_squares_regression.json": {
                name: string;
                path: string;
                categories: {
                    subtype: string;
                    type: string;
                };
                tags: string[];
                units: {
                    name: string;
                    path: string;
                    categories: {
                        subtype: string;
                        type: string;
                    };
                    tags: string[];
                }[];
            };
        };
    };
    getAllMethods(): MethodConfig[];
    getMethodByName(name: string): MethodConfig | undefined;
    getMethodsByUnitType(unitType: string): MethodConfig[];
    getMethodsByUnitSubtype(unitSubtype: string): MethodConfig[];
    getMethodsByUnitTags(...tags: string[]): MethodConfig[];
    getMethodsByPath(path: string): MethodConfig[];
    getMethodsByUnitParameters(parameters: Record<string, any>): MethodConfig[];
    getAllMethodNames(): string[];
    getAllMethodPaths(): string[];
    getAllUnits(): MethodUnit[];
    getUniqueUnitTypes(): string[];
    getUniqueUnitSubtypes(): string[];
    getMethodsCompatibleWithModel(modelPath: string, filterMap: Record<string, any>): MethodConfig[];
}
