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
export declare class SubworkflowStandata extends Standata {
    static runtimeData: {
        standataConfig: {
            categories: {
                application: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "espresso_average_electrostatic_potential_find_minima.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        name: string;
                        execName: string;
                        flavorName: string;
                        flowchartId: string;
                        operand?: undefined;
                        value?: undefined;
                        input?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        operand: string;
                        value: string;
                        input: {
                            name: string;
                            scope: string;
                        }[];
                        execName?: undefined;
                        flavorName?: undefined;
                        flowchartId?: undefined;
                    };
                    type: string;
                })[];
            };
            "espresso_average_electrostatic_potential_via_band_structure.json": {
                config: {
                    isMultiMaterial: boolean;
                };
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        name: string;
                        operand: string;
                        value: number;
                        execName?: undefined;
                        flavorName?: undefined;
                        flowchartId?: undefined;
                        input?: undefined;
                    };
                    type: string;
                    attributes?: undefined;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                        operand?: undefined;
                        value?: undefined;
                        flowchartId?: undefined;
                        input?: undefined;
                    };
                    type: string;
                    attributes?: undefined;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                        flowchartId: string;
                        operand?: undefined;
                        value?: undefined;
                        input?: undefined;
                    };
                    type: string;
                    attributes: {
                        results: {
                            name: string;
                        }[];
                    };
                } | {
                    config: {
                        name: string;
                        operand: string;
                        value: string;
                        input: {
                            name: string;
                            scope: string;
                        }[];
                        execName?: undefined;
                        flavorName?: undefined;
                        flowchartId?: undefined;
                    };
                    type: string;
                    attributes?: undefined;
                } | {
                    config: {
                        name: string;
                        operand: string;
                        value: string;
                        execName?: undefined;
                        flavorName?: undefined;
                        flowchartId?: undefined;
                        input?: undefined;
                    };
                    type: string;
                    attributes?: undefined;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                        flowchartId: string;
                        operand?: undefined;
                        value?: undefined;
                        input?: undefined;
                    };
                    type: string;
                    attributes?: undefined;
                })[];
            };
            "espresso_band_gap.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_band_gap_hse_dos.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                model: {
                    name: string;
                    config: {
                        type: string;
                        subtype: string;
                        functional: {
                            name: string;
                            slug: string;
                        };
                    };
                };
                method: {
                    name: string;
                    config: {
                        type: string;
                        subtype: string;
                    };
                };
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_band_structure.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_band_structure_dos.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_band_structure_hse.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                model: {
                    name: string;
                    config: {
                        type: string;
                        subtype: string;
                        functional: {
                            name: string;
                            slug: string;
                        };
                    };
                };
                method: {
                    name: string;
                    config: {
                        type: string;
                        subtype: string;
                    };
                };
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_band_structure_magn.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_band_structure_soc.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                    setSearchText: string;
                    config: {
                        type: string;
                        subtype: string;
                    };
                };
                model: {
                    name: string;
                };
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_dielectric_tensor.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    config: {
                        data: {};
                        subtype: string;
                        type: string;
                    };
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                        operand?: undefined;
                        value?: undefined;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        operand: string;
                        value: boolean;
                        execName?: undefined;
                        flavorName?: undefined;
                    };
                    type: string;
                    functions?: undefined;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                        operand?: undefined;
                        value?: undefined;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_dos.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_electronic_density_mesh.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_esm.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_esm_relax.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_espresso_extract_kpoints.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                units: {
                    config: {
                        name: string;
                        execName: string;
                        flavorName: string;
                    };
                    type: string;
                }[];
            };
            "espresso_espresso_xml_get_qpt_irr.json": {
                application: {
                    name: string;
                    version: string;
                };
                dynamicSubworkflow: {
                    name: string;
                    subfolder: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: never[];
            };
            "espresso_fixed_cell_relaxation.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "espresso_gw_band_structure_band_gap_full_frequency.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                    setSearchText: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_gw_band_structure_band_gap_plasmon_pole.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                    setSearchText: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_hubbard_u_hp.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "espresso_kpoint_convergence.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                units: ({
                    config: {
                        name: string;
                        flowchartId: string;
                        operand: string;
                        value: number;
                        execName?: undefined;
                        flavorName?: undefined;
                        input?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        execName: string;
                        flavorName: string;
                        operand?: undefined;
                        value?: undefined;
                        input?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        operand: string;
                        value: string;
                        input: {
                            name: string;
                            scope: string;
                        }[];
                        execName?: undefined;
                        flavorName?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        statement: string;
                        maxOccurrences: number;
                        then: string;
                        else: string;
                        operand?: undefined;
                        value?: undefined;
                        execName?: undefined;
                        flavorName?: undefined;
                        input?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        operand: string;
                        value: string;
                        input: {
                            name: string;
                            scope: string;
                        }[];
                        next: string;
                        execName?: undefined;
                        flavorName?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                    };
                    type: string;
                })[];
            };
            "espresso_neb.json": {
                application: {
                    name: string;
                    version: string;
                };
                config: {
                    isMultiMaterial: boolean;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_ph_init_qpoints.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_ph_single_irr_qpt.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_phonon_dispersions.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_phonon_dos.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_phonon_dos_dispersion.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_phonon_reduce.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_post_processor.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_pre_processor.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_pw_scf.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "espresso_recalculate_bands.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_surface_energy.json": {
                application: {
                    name: string;
                    version: string;
                };
                dynamicSubworkflow: {
                    name: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "espresso_total_energy.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "espresso_valence_band_offset_calc_from_previous_esp_vbm.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        name: string;
                        operand: string;
                        value: string;
                        results?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        operand: string;
                        value: string;
                        results: {
                            name: string;
                        }[];
                    };
                    type: string;
                })[];
            };
            "espresso_variable_cell_relaxation.json": {
                application: {
                    name: string;
                    version: string;
                };
                config: {
                    systemName: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "espresso_zero_point_energy.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "jupyterLab_jupyter_notebook.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    attributes: {
                        preProcessors: {
                            name: string;
                        }[];
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "nwchem_total_energy.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "python_python_script.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "python_ml_classification_tail.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    attributes: {
                        enableRender: boolean;
                        results?: undefined;
                        tags?: undefined;
                        postProcessors?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    attributes?: undefined;
                } | {
                    attributes: {
                        results: {
                            name: string;
                        }[];
                        tags: string[];
                        enableRender?: undefined;
                        postProcessors?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                } | {
                    attributes: {
                        postProcessors: {
                            name: string;
                        }[];
                        results: {
                            basename: string;
                            filetype: string;
                            name: string;
                        }[];
                        tags: string[];
                        enableRender?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                })[];
            };
            "python_ml_clustering_tail.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    attributes: {
                        enableRender: boolean;
                        results?: undefined;
                        tags?: undefined;
                        postProcessors?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    attributes?: undefined;
                } | {
                    attributes: {
                        results: {
                            name: string;
                        }[];
                        tags: string[];
                        enableRender?: undefined;
                        postProcessors?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                } | {
                    attributes: {
                        postProcessors: {
                            name: string;
                        }[];
                        results: {
                            basename: string;
                            filetype: string;
                            name: string;
                        }[];
                        tags: string[];
                        enableRender?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                })[];
            };
            "python_ml_regression_tail.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    attributes: {
                        enableRender: boolean;
                        results?: undefined;
                        tags?: undefined;
                        postProcessors?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    attributes?: undefined;
                } | {
                    attributes: {
                        results: {
                            name: string;
                        }[];
                        tags: string[];
                        enableRender?: undefined;
                        postProcessors?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                } | {
                    attributes: {
                        postProcessors: {
                            name: string;
                        }[];
                        results: {
                            basename: string;
                            filetype: string;
                            name: string;
                        }[];
                        tags: string[];
                        enableRender?: undefined;
                    };
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                })[];
            };
            "python_ml_train_head.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        flowchartId: string;
                        name: string;
                        operand: string;
                        tags: string[];
                        value: string;
                        enableRender?: undefined;
                        input?: undefined;
                        source?: undefined;
                        else?: undefined;
                        statement?: undefined;
                        then?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        enableRender: boolean;
                        flowchartId: string;
                        input: {
                            basename: string;
                            objectData: {
                                CONTAINER: string;
                                NAME: string;
                                PROVIDER: string;
                                REGION: string;
                            };
                        }[];
                        name: string;
                        source: string;
                        operand?: undefined;
                        tags?: undefined;
                        value?: undefined;
                        else?: undefined;
                        statement?: undefined;
                        then?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        else: string;
                        flowchartId: string;
                        input: {
                            name: string;
                            scope: string;
                        }[];
                        name: string;
                        statement: string;
                        then: string;
                        operand?: undefined;
                        tags?: undefined;
                        value?: undefined;
                        enableRender?: undefined;
                        source?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        enableRender: boolean;
                        flowchartId: string;
                        input: {
                            basename: string;
                            objectData: {
                                CONTAINER: string;
                                NAME: string;
                                PROVIDER: string;
                                REGION: string;
                            };
                        }[];
                        name: string;
                        source: string;
                        tags: string[];
                        operand?: undefined;
                        value?: undefined;
                        else?: undefined;
                        statement?: undefined;
                        then?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        flowchartId: string;
                        name: string;
                        operand: string;
                        value: string;
                        tags?: undefined;
                        enableRender?: undefined;
                        input?: undefined;
                        source?: undefined;
                        else?: undefined;
                        statement?: undefined;
                        then?: undefined;
                    };
                    type: string;
                })[];
            };
            "shell_batch_espresso_pwscf.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "shell_hello_world.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "vasp_band_gap.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "vasp_band_structure.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "vasp_band_structure_dos.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        addResults: string[];
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "vasp_dos.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        addResults: string[];
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "vasp_fixed_cell_relaxation.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "vasp_initial_final_total_energies.json": {
                application: {
                    name: string;
                    version: string;
                };
                config: {
                    isMultiMaterial: boolean;
                    functions: {
                        setDefaultCompute: null;
                    };
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "vasp_kpoint_convergence.json": {
                name: string;
                application: {
                    name: string;
                    version: string;
                };
                model: {
                    name: string;
                };
                method: {
                    config: {
                        type: string;
                        subtype: string;
                    };
                    name: string;
                };
                units: ({
                    config: {
                        name: string;
                        flowchartId: string;
                        operand: string;
                        value: number;
                        execName?: undefined;
                        flavorName?: undefined;
                        input?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        execName: string;
                        flavorName: string;
                        operand?: undefined;
                        value?: undefined;
                        input?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        operand: string;
                        value: string;
                        input: {
                            name: string;
                            scope: string;
                        }[];
                        execName?: undefined;
                        flavorName?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        statement: string;
                        maxOccurrences: number;
                        then: string;
                        else: string;
                        operand?: undefined;
                        value?: undefined;
                        execName?: undefined;
                        flavorName?: undefined;
                        input?: undefined;
                        next?: undefined;
                    };
                    type: string;
                } | {
                    config: {
                        name: string;
                        flowchartId: string;
                        operand: string;
                        value: string;
                        input: {
                            name: string;
                            scope: string;
                        }[];
                        next: string;
                        execName?: undefined;
                        flavorName?: undefined;
                        statement?: undefined;
                        maxOccurrences?: undefined;
                        then?: undefined;
                        else?: undefined;
                    };
                    type: string;
                })[];
            };
            "vasp_neb_subworkflow.json": {
                application: {
                    name: string;
                    version: string;
                };
                config: {
                    isMultiMaterial: boolean;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "vasp_prepare_images.json": {
                application: {
                    name: string;
                    version: string;
                };
                config: {
                    isMultiMaterial: boolean;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                }[];
            };
            "vasp_recalculate_bands.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "vasp_surface_energy.json": {
                application: {
                    name: string;
                    version: string;
                };
                dynamicSubworkflow: {
                    name: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "vasp_total_energy.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "vasp_variable_cell_relaxation.json": {
                application: {
                    name: string;
                    version: string;
                };
                config: {
                    systemName: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "vasp_zero_point_energy.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
            "deepmd_deepmd.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: ({
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                } | {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    type: string;
                    functions?: undefined;
                })[];
            };
            "deepmd_espresso_cp_md.json": {
                application: {
                    name: string;
                    version: string;
                };
                method: {
                    name: string;
                };
                model: {
                    name: string;
                };
                name: string;
                units: {
                    config: {
                        execName: string;
                        flavorName: string;
                        name: string;
                    };
                    functions: {
                        head: boolean;
                    };
                    type: string;
                }[];
            };
        };
    };
}
