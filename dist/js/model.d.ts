import { Standata } from "./base";
import { ModelConfig } from "./types/model";
export declare class ModelStandata extends Standata<ModelConfig> {
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
            "lda/dft_lda_pz_collinear.json": {
                parameters: {
                    spinPolarization: string;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz_d3_collinear.json": {
                parameters: {
                    spinPolarization: string;
                    dispersionCorrection: string;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz_d3_soc.json": {
                parameters: {
                    spinOrbitCoupling: boolean;
                    dispersionCorrection: string;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz_d3.json": {
                parameters: {
                    dispersionCorrection: string;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz_soc.json": {
                parameters: {
                    spinOrbitCoupling: boolean;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz_u_collinear.json": {
                parameters: {
                    spinPolarization: string;
                    hubbardType: string;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz_u_soc.json": {
                parameters: {
                    hubbardType: string;
                    spinOrbitCoupling: boolean;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz_u.json": {
                parameters: {
                    hubbardType: string;
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
            "lda/dft_lda_pz.json": {
                parameters: {
                    functional: string;
                };
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                    subtype: string;
                };
                tags: string[];
                name: string;
                path: string;
            };
        };
    };
    getByName(name: string): ModelConfig | undefined;
    getByCategory(category: string): ModelConfig[];
    getBySubtype(subtype: string): ModelConfig[];
    getByTags(...tags: string[]): ModelConfig[];
    getByPath(path: string): ModelConfig[];
    getByParameters(parameters: Record<string, any>): ModelConfig[];
    getAllModelNames(): string[];
    getAllModelPaths(): string[];
    getUniqueSubtypes(): string[];
}
