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
            "gga/dft_gga_pbe_collinear.json": {
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
            "gga/dft_gga_pbe_d3_collinear.json": {
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
            "gga/dft_gga_pbe_d3_soc.json": {
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
            "gga/dft_gga_pbe_d3.json": {
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
            "gga/dft_gga_pbe_soc.json": {
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
            "gga/dft_gga_pbe_u_collinear.json": {
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
            "gga/dft_gga_pbe_u_soc.json": {
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
            "gga/dft_gga_pbe_u.json": {
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
            "gga/dft_gga_pbe.json": {
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
            "gga/dft_gga_pbesol_collinear.json": {
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
            "gga/dft_gga_pbesol_d3_collinear.json": {
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
            "gga/dft_gga_pbesol_d3_soc.json": {
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
            "gga/dft_gga_pbesol_d3.json": {
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
            "gga/dft_gga_pbesol_soc.json": {
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
            "gga/dft_gga_pbesol_u_collinear.json": {
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
            "gga/dft_gga_pbesol_u_soc.json": {
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
            "gga/dft_gga_pbesol_u.json": {
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
            "gga/dft_gga_pbesol.json": {
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
            "hybrid/dft_hybrid_b3lyp_collinear.json": {
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
            "hybrid/dft_hybrid_b3lyp_d3_collinear.json": {
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
            "hybrid/dft_hybrid_b3lyp_d3_soc.json": {
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
            "hybrid/dft_hybrid_b3lyp_d3.json": {
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
            "hybrid/dft_hybrid_b3lyp_soc.json": {
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
            "hybrid/dft_hybrid_b3lyp.json": {
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
            "hybrid/dft_hybrid_hse_collinear.json": {
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
            "hybrid/dft_hybrid_hse_d3_collinear.json": {
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
            "hybrid/dft_hybrid_hse_d3_soc.json": {
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
            "hybrid/dft_hybrid_hse_d3.json": {
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
            "hybrid/dft_hybrid_hse_soc.json": {
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
            "hybrid/dft_hybrid_hse.json": {
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
            "unknown/regression.json": {
                categories: {
                    tier1: string;
                    tier2: string;
                    tier3: string;
                    type: string;
                };
                parameters: {};
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
