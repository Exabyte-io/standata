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
            "diagonalization/conjugate_gradient_diagonalization.json": {
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "occupations/gaussian_smearing.json": {
                categories: {
                    subtype: string;
                    tier1: string;
                    tier2: string;
                    type: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "occupations/linear_tetrahedron_method.json": {
                categories: {
                    subtype: string;
                    tier1: string;
                    tier2: string;
                    type: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "psp/norm_conserving_pseudopotential.json": {
                categories: {
                    subtype: string;
                    tier1: string;
                    tier2: string;
                    type: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "pw/plane_wave_norm_conserving_pseudopotential_conjugate_gradient_diagonalization_gaussian_smearing.json": {
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
                name: string;
                path: string;
            };
            "pw/plane_wave_norm_conserving_pseudopotential_conjugate_gradient_diagonalization_linear_tetrahedron_method.json": {
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
                name: string;
                path: string;
            };
            "pw/wave_function_plane_wave.json": {
                categories: {
                    tier1: string;
                    tier2: string;
                    type: string;
                };
                tags: string[];
                name: string;
                path: string;
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
