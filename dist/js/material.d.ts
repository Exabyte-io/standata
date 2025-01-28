import { Standata } from "./base";
export declare class MaterialStandata extends Standata {
    static runtimeData: {
        standataConfig: {
            categories: {
                type: string[];
                form_factor: string[];
                dimensionality: string[];
                electrical_conductivity: string[];
                magnetism: string[];
                superconductivity: string[];
                composition: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-3993].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "C-[Graphite]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-48].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "BN-[Hexagonal_Boron_Nitride]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-4991].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "BN-[Boron_Nitride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-7991].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: null;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "NaCl-[Sodium_Chloride]-FCC_[Fm-3m]_3D_[Bulk]-[mp-22862].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Si-[Silicon]-FCC_[Fd-3m]_3D_[Bulk]-[mp-149].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Si-[Silicene]-HEX_[P-3m1]_2D_[Monolayer]-[2dm-5934].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "WS2-[Tungsten_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-224].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "WS2-[Tungsten_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3749].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Ni-[Nickel]-FCC_[Fm-3m]_3D_[Bulk]-[mp-23].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Cu-[Copper]-FCC_[Fm-3m]_3D_[Bulk]-[mp-30].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Au-[Gold]-FCC_[Fm-3m]_3D_[Bulk]-[mp-81].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "ZnO-[Zinc_Oxide]-HEX_[P6_3mc]_3D_[Bulk]-[mp-2133].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Al2O3-[Sapphire]-RHL_[R-3c]_3D_[Bulk]-[mp-1143].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "SiO2-[Quartz]-HEX_[P3_121]_3D_[Bulk]-[mp-7000].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "ZrO2-[Zirconium_Dioxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-2858].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "HfO2-[Hafnium_IV_Oxide]-MCL_[P2_1%2Fc]_3D_[Bulk]-[mp-352].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Y2O3-[Yttrium_III_Oxide]-MCLC_[C2%2Fm]_3D_[Bulk]-[mp-558573].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "VO2-[Vanadium_IV_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-19094].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: null;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "TiO2-[Titanium_Oxide]-TET_[P4_2%2Fmnm]_3D_[Bulk]-[mp-2657].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: null;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "MoS2-[Molybdenum_Disulfide]-HEX_[P_3%2Fmmc]_3D_[Bulk]-[mp-2815].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "MoS2-[Molybdenum_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3150].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Te2Mo-[Molybdenum_Telluride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-602].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: null;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Te2Mo-[Molybdenum_Telluride]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-5370].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "WSe2-[Tungsten_Diselenide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-1821].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "WSe2-[Tungsten_Diselenide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3594].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "GaN-[Gallium_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-804].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "GaAs-[Gallium_Arsenide]-FCC_[F-43m]_3D_[Bulk]-[mp-2534].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "AlN-[Aluminum_Nitride]-HEX_[P6_3mc]_3D_[Bulk]-[mp-661].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "TiN-[Titanium_Nitride]-FCC_[Fm-3m]_3D_[Bulk]-[mp-492].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: null;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "C-[Diamond]-FCC_[Fd-3m]_3D_[Bulk]-[mp-66].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Pt-[Platinum]-FCC_[Fm-3m]_3D_[Bulk]-[mp-126].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "SrTiO3-[Strontium_Titanate]-CUB_[Pm-3m]_3D_[Bulk]-[mp-5229].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "SiO2-[Cristobalite]-TET_[I-42d]_3D_[Bulk]-[mp-546794].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Si-[Silicon_(100)_surface_(reconstructed)]-TRI_[P1]_2D_[Surface]-[mavrl-si-100-r].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "Si-[Silicon_(100)_surface]-TRI_[P1]_2D_[Surface]-[mavrl-si-100].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "NbS2-[Niobium_Disulfide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-10033].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "NbSe2-[Niobium_Diselenide]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-2207].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "HfO2-[Hafnium_IV_Oxide]-ORC_[Pnma]_3D_[Bulk]-[mp-741].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "HfO2-[Hafnium_IV_Oxide]-FCC_[Fm-3m]_3D_[Bulk]-[mp-550893].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "SnO-[Tin_Oxide]-TET_[P4%2Fnmm]_3D_[Bulk]-[mp-2097].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "NbSe2-[Niobium_Diselenide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3941].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "NbS2-[Niobium_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3019].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
            "C-[Graphene_Zigzag_Nanoribbon_(W=4_L=10)]-ORC_[Pmm2]_2D_[Nanoribbon]-[m3-z53HK5wLAvRoWDwr6].json": {
                name: string;
                lattice: {
                    type: string;
                    a: number;
                    b: number;
                    c: number;
                    alpha: number;
                    beta: number;
                    gamma: number;
                    units: {
                        length: string;
                        angle: string;
                    };
                };
                basis: {
                    units: string;
                    elements: {
                        id: number;
                        value: string;
                    }[];
                    coordinates: {
                        id: number;
                        value: number[];
                    }[];
                };
                external: {
                    id: string;
                    source: string;
                    doi: string;
                    url: string;
                    origin: boolean;
                };
                isNonPeriodic: boolean;
            };
        };
    };
}
