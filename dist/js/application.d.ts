import type { TemplateSchema } from "@mat3ra/esse/dist/js/types";
import { Standata } from "./base";
import { ApplicationExecutableTree, ApplicationVersionsMapType, DefaultApplicationConfig } from "./types/application";
export declare enum TAGS {
    DEFAULT = "default",
    DEFAULT_VERSION = "default_version",
    DEFAULT_BUILD = "default_build"
}
export declare class ApplicationStandata extends Standata<ApplicationVersionsMapType> {
    static runtimeData: {
        filesMapByName: {
            "espresso/espresso_gnu_6.3.json": {
                build: string;
                hasAdvancedComputeOptions: boolean;
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "nwchem/nwchem_gnu_7.0.2.json": {
                build: string;
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "python/python_gnu_3.10.13.json": {
                build: string;
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "shell/shell_gnu_5.1.8.json": {
                build: string;
                isDefault: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
            "vasp/vasp_gnu_5.4.4.json": {
                build: string;
                isDefault: boolean;
                isLicensed: boolean;
                name: string;
                shortName: string;
                summary: string;
                version: string;
            };
        };
        standataConfig: {
            categories: {
                defaults: string[];
                language_type: string[];
                model: string[];
                purpose: string[];
            };
            entities: {
                categories: string[];
                filename: string;
            }[];
        };
    };
    getAppDataForApplication(appName: string): ApplicationVersionsMapType;
    getAppTreeForApplication(appName: string): ApplicationExecutableTree;
    getAllAppTemplates(): TemplateSchema[];
    getAllAppTree(): {
        espresso: {
            "abcoeff_to_eps.x": {
                flavors: {
                    abcoeff_to_eps_simple: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "average.x": {
                flavors: {
                    average: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                    average_potential: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "bands.x": {
                flavors: {
                    bands: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                    };
                    bands_spin_dn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                    };
                    bands_spin_up: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "cp.x": {
                flavors: {
                    cp: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        isDefault: boolean;
                        monitors: string[];
                        results: never[];
                    };
                    cp_wf: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "dos.x": {
                flavors: {
                    dos: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "dynmat.x": {
                flavors: {
                    dynmat: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "epsilon.x": {
                flavors: {
                    dielectric_tensor: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "gw.x": {
                flavors: {
                    gw_bands_full_frequency: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    gw_bands_plasmon_pole: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "gww.x": {
                flavors: {
                    gww_simple: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "head.x": {
                flavors: {
                    head_simple: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "hp.x": {
                flavors: {
                    hp: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
                supportedApplicationVersions: string[];
            };
            "matdyn.x": {
                flavors: {
                    matdyn_grid: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    matdyn_path: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "neb.x": {
                flavors: {
                    neb: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        isMultiMaterial: boolean;
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "ph.x": {
                flavors: {
                    ph_gamma: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    ph_grid: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    ph_grid_restart: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                    ph_init_qpoints: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                    ph_path: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    ph_single_irr_qpt: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "pp.x": {
                flavors: {
                    pp_density: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                    pp_electrostatic_potential: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                    pp_wfn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "projwfc.x": {
                flavors: {
                    projwfc: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                monitors: string[];
                results: string[];
            };
            "pw.x": {
                flavors: {
                    pw_bands: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pw_bands_dft_u+j_magn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    "pw_bands_dft_u+v_magn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_dft_u_magn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_dft_u_magn_legacy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_dft_u_soc: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_dft_u_soc_legacy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_magn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_bands_soc: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_esm: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_esm_relax: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_md: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_nscf: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pw_nscf_dft_u+j_magn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    "pw_nscf_dft_u+v_magn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_dft_u_magn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_dft_u_magn_legacy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_dft_u_soc: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_dft_u_soc_legacy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_magn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_nscf_soc: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_relax: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_scf: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        isDefault: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    pw_scf_bands_hse: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_scf_dft_u: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+j": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+j_magn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+v": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+v_magn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_legacy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_magn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_magn_legacy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_soc: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_soc_legacy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_hse: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_scf_kpt_conv: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_scf_magn: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    pw_scf_soc: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pw_vc-relax": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                hasAdvancedComputeOptions: boolean;
                isDefault: boolean;
                monitors: string[];
                postProcessors: string[];
                results: string[];
            };
            "pw4gww.x": {
                flavors: {
                    pw4gww_simple: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "q2r.x": {
                flavors: {
                    q2r: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "simple.x": {
                flavors: {
                    simple: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "simple_bse.x": {
                flavors: {
                    simple_bse: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
            "simple_ip.x": {
                flavors: {
                    simple_ip: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: never[];
                    };
                };
                monitors: string[];
                results: never[];
            };
        };
        nwchem: {
            nwchem: {
                flavors: {
                    nwchem_total_energy: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        isDefault: boolean;
                        monitors: string[];
                        results: string[];
                    };
                };
                hasAdvancedComputeOptions: boolean;
                isDefault: boolean;
                monitors: string[];
                postProcessors: string[];
                results: string[];
            };
        };
        python: {
            python: {
                flavors: {
                    espresso_extract_kpoints: {
                        applicationName: string;
                        executableName: string;
                        input: ({
                            name: string;
                            templateName?: undefined;
                        } | {
                            name: string;
                            templateName: string;
                        })[];
                        monitors: string[];
                    };
                    espresso_xml_get_qpt_irr: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                    };
                    extract_bands_fermi: {
                        applicationName: string;
                        executableName: string;
                        input: ({
                            name: string;
                            templateName?: undefined;
                        } | {
                            name: string;
                            templateName: string;
                        })[];
                        monitors: string[];
                    };
                    "generic:post_processing:plot:matplotlib": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "generic:processing:find_extrema:scipy": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    hello_world: {
                        applicationName: string;
                        executableName: string;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        isDefault: boolean;
                        monitors: string[];
                    };
                    plot_wavefunction: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:custom": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "pyml:data_input:read_csv:pandas": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "pyml:data_input:train_test_split:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "pyml:model:adaboosted_trees_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:bagged_trees_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:extreme_gradboosted_trees_classification:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:extreme_gradboosted_trees_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:gradboosted_trees_classification:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:gradboosted_trees_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:k_means_clustering:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:kernel_ridge_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:lasso_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:multilayer_perceptron:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:random_forest_classification:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:random_forest_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:model:ridge_regression:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:post_processing:parity_plot:matplotlib": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:post_processing:pca_2d_clusters:matplotlib": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:post_processing:roc_curve:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    "pyml:pre_processing:min_max_scaler:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "pyml:pre_processing:remove_duplicates:pandas": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "pyml:pre_processing:remove_missing:pandas": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "pyml:pre_processing:standardization:sklearn": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                    "pyml:setup_variables_packages": {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                    };
                };
                isDefault: boolean;
                monitors: string[];
                results: string[];
            };
        };
        shell: {
            sh: {
                flavors: {
                    bash_vasp_prepare_neb_images: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        isMultiMaterial: boolean;
                        monitors: string[];
                    };
                    espresso_collect_dynmat: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                    };
                    espresso_link_outdir_save: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                    };
                    hello_world: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        isDefault: boolean;
                        monitors: string[];
                    };
                    job_espresso_pw_scf: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                    };
                };
                isDefault: boolean;
                monitors: string[];
                results: string[];
            };
        };
        vasp: {
            vasp: {
                flavors: {
                    vasp: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                        }[];
                        isDefault: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    vasp_bands: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    vasp_bands_hse: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        isDefault: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    vasp_hse: {
                        applicationName: string;
                        executableName: string;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        isDefault: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    vasp_kpt_conv: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    vasp_neb: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        isMultiMaterial: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    vasp_neb_final: {
                        applicationName: string;
                        executableName: string;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        isMultiMaterial: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    vasp_neb_initial: {
                        applicationName: string;
                        executableName: string;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        isMultiMaterial: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    vasp_nscf: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    vasp_nscf_hse: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        isDefault: boolean;
                        monitors: string[];
                        results: string[];
                    };
                    vasp_relax: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        postProcessors: string[];
                        results: string[];
                    };
                    vasp_symprec: {
                        applicationName: string;
                        executableName: string;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        monitors: string[];
                        results: string[];
                    };
                    vasp_vc_relax: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        postProcessors: string[];
                        results: string[];
                    };
                    vasp_vc_relax_conv: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                    vasp_zpe: {
                        applicationName: string;
                        executableName: string;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                    };
                };
                isDefault: boolean;
                monitors: string[];
                postProcessors: string[];
                results: string[];
            };
        };
    };
    getAllApplicationNames(): string[];
    getAllAppData(): ApplicationVersionsMapType[];
    getTemplatesByName(appName: string, execName: string, templateName?: string): TemplateSchema[];
    getByApplicationName(appName: string): ApplicationVersionsMapType[];
    static getDefaultVersionForApplication(appName: string): string;
    static getDefaultBuildForApplicationAndVersion(appName: string, version: string): string;
    getDefaultConfigByNameAndVersion(appName: string, version?: string): ApplicationVersionsMapType;
    getDefaultConfig(): DefaultApplicationConfig;
}
