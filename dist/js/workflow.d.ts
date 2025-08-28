import { Standata } from "./base";
export declare class WorkflowStandata extends Standata {
    static runtimeData: {
        standataConfig: {
            categories: {
                application: string[];
                property: string[];
                material_count: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "espresso_band_gap.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_band_gap_dos_hse.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_band_structure.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_band_structure_dos.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_band_structure_hse.json": {
                name: string;
                units: ({
                    name: string;
                    type: string;
                    config: {
                        attributes: {
                            name: string;
                        };
                    };
                } | {
                    name: string;
                    type: string;
                    config?: undefined;
                })[];
            };
            "espresso_band_structure_magn.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                    config: {
                        attributes: {
                            name: string;
                        };
                    };
                }[];
            };
            "espresso_band_structure_soc.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                    config: {
                        attributes: {
                            name: string;
                        };
                    };
                }[];
            };
            "espresso_dielectric_tensor.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_dos.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_electronic_density_mesh.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_esm.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_esm_relax.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_fixed_cell_relaxation.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_gw_band_structure_band_gap_full_frequency.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_gw_band_structure_band_gap_plasmon_pole.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_hubbard_u_hp.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                    config: {
                        attributes: {
                            name: string;
                        };
                    };
                }[];
            };
            "espresso_kpoint_convergence.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_neb.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_phonon_dispersions.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_phonon_dos.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_phonon_dos_dispersion.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_phonon_map.json": {
                name: string;
                units: ({
                    name: string;
                    type: string;
                    units: {
                        name: string;
                        type: string;
                    }[];
                    config?: undefined;
                } | {
                    config: {
                        functions: {
                            setDefaultCompute: null;
                        };
                        input: {
                            name: string;
                        };
                        mapUnit: boolean;
                    };
                    name: string;
                    type: string;
                    units: {
                        name: string;
                        type: string;
                    }[];
                } | {
                    name: string;
                    type: string;
                    units?: undefined;
                    config?: undefined;
                })[];
            };
            "espresso_recalculate_bands.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_surface_energy.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_total_energy.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_valence_band_offset.json": {
                name: string;
                units: ({
                    name: string;
                    type: string;
                    config: {
                        attributes: {
                            name: string;
                        };
                    };
                    unitConfigs: ({
                        index: number;
                        type: string;
                        config: {
                            attributes: {
                                name: string;
                                value: string;
                                flowchartId?: undefined;
                                input?: undefined;
                                operand?: undefined;
                            };
                        };
                    } | {
                        index: number;
                        type: string;
                        config: {
                            attributes: {
                                flowchartId: string;
                                name?: undefined;
                                value?: undefined;
                                input?: undefined;
                                operand?: undefined;
                            };
                        };
                    } | {
                        index: number;
                        type: string;
                        config: {
                            attributes: {
                                input: {
                                    name: string;
                                    scope: string;
                                }[];
                                name?: undefined;
                                value?: undefined;
                                flowchartId?: undefined;
                                operand?: undefined;
                            };
                        };
                    } | {
                        index: number;
                        type: string;
                        config: {
                            attributes: {
                                operand: string;
                                name?: undefined;
                                value?: undefined;
                                flowchartId?: undefined;
                                input?: undefined;
                            };
                        };
                    })[];
                } | {
                    name: string;
                    type: string;
                    config: {
                        attributes: {
                            name: string;
                        };
                    };
                    unitConfigs: ({
                        index: number;
                        type: string;
                        config: {
                            attributes: {
                                flowchartId: string;
                                operand?: undefined;
                                input?: undefined;
                            };
                        };
                    } | {
                        index: number;
                        type: string;
                        config: {
                            attributes: {
                                operand: string;
                                input: {
                                    name: string;
                                    scope: string;
                                }[];
                                flowchartId?: undefined;
                            };
                        };
                    })[];
                } | {
                    name: string;
                    type: string;
                    config?: undefined;
                    unitConfigs?: undefined;
                })[];
            };
            "espresso_variable_cell_relaxation.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "espresso_zero_point_energy.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "jupyterLab_jupyter_notebook.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "nwchem_total_energy.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "python_python_script.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "python_ml_classification_workflow.json": {
                config: {
                    attributes: {
                        isUsingDataset: boolean;
                    };
                };
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "python_ml_clustering_workflow.json": {
                config: {
                    attributes: {
                        isUsingDataset: boolean;
                    };
                };
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "python_ml_regression_workflow.json": {
                config: {
                    attributes: {
                        isUsingDataset: boolean;
                    };
                };
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "shell_batch_espresso_pwscf.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "shell_hello_world.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_band_gap.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_band_structure.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_band_structure_dos.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_dos.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_fixed_cell_relaxation.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_kpoint_convergence.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_neb.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_recalculate_bands.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_surface_energy.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_total_energy.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_variable_cell_relaxation.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "vasp_zero_point_energy.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
            "deepmd_deepmd_md.json": {
                name: string;
                units: {
                    name: string;
                    type: string;
                }[];
            };
        };
    };
}
