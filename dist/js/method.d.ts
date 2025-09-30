import { Standata } from "./base";
import { MethodConfig, UnitMethod } from "./types/method";
import { ModelConfig } from "./types/model";
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
            "any_plane_wave_pseudopotential_method.json": {
                name: string;
                path: string;
                units: ({
                    categories: {
                        subtype: string;
                        tier1: string;
                        tier2: string;
                        type: string;
                    };
                    tags: string[];
                    name: string;
                    path: string;
                } | {
                    categories: {
                        tier1: string;
                        tier2: string;
                        type: string;
                        subtype?: undefined;
                    };
                    tags: string[];
                    name: string;
                    path: string;
                })[];
            };
            "linear_least_squares_regression.json": {
                name: string;
                path: string;
                units: {
                    categories: {
                        subtype: string;
                        type: string;
                    };
                    tags: string[];
                    name: string;
                    path: string;
                }[];
            };
            "pw_us_cg_gaussian.json": {
                name: string;
                path: string;
                units: ({
                    categories: {
                        subtype: string;
                        tier1: string;
                        tier2: string;
                        type: string;
                        tier3?: undefined;
                    };
                    tags: string[];
                    name: string;
                    path: string;
                } | {
                    categories: {
                        tier1: string;
                        tier2: string;
                        tier3: string;
                        type: string;
                        subtype?: undefined;
                    };
                    tags: string[];
                    name: string;
                    path: string;
                } | {
                    categories: {
                        tier1: string;
                        tier2: string;
                        type: string;
                        subtype?: undefined;
                        tier3?: undefined;
                    };
                    tags: string[];
                    name: string;
                    path: string;
                })[];
            };
        };
    };
    getByName(name: string): MethodConfig | undefined;
    getByUnitType(unitType: string): MethodConfig[];
    getByUnitSubtype(unitSubtype: string): MethodConfig[];
    getByUnitTags(...tags: string[]): MethodConfig[];
    getByPath(path: string): MethodConfig[];
    getByUnitParameters(parameters: Record<string, any>): MethodConfig[];
    getAllMethodNames(): string[];
    getAllMethodPaths(): string[];
    getAllUnits(): UnitMethod[];
    getUniqueUnitTypes(): string[];
    getUniqueUnitSubtypes(): string[];
    getCompatibleWithModel(model: ModelConfig): MethodConfig[];
}
