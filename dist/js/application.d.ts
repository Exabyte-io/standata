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
        standataConfig: {
            categories: {
                model: string[];
                language_type: string[];
                purpose: string[];
                defaults: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "espresso/espresso_gnu_6.3.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                isDefault: boolean;
                build: string;
                hasAdvancedComputeOptions: boolean;
            };
            "vasp/vasp_gnu_5.4.4.json": {
                name: string;
                shortName: string;
                summary: string;
                isLicensed: boolean;
                version: string;
                isDefault: boolean;
                build: string;
            };
            "nwchem/nwchem_gnu_7.0.2.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                isDefault: boolean;
                build: string;
            };
            "python/python_default_3.10.13.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                isDefault: boolean;
                build: string;
            };
        };
    };
    getAppDataForApplication(appName: string): ApplicationVersionsMapType;
    getAppTreeForApplication(appName: string): ApplicationExecutableTree;
    getAllAppTemplates(): TemplateSchema[];
    getAllAppTree(): {
        espresso: {
            "abcoeff_to_eps.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    abcoeff_to_eps_simple: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "average.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    average: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    average_potential: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "bands.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    bands: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    bands_spin_up: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    bands_spin_dn: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "cp.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    cp: {
                        isDefault: boolean;
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    cp_wf: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "dos.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    dos: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "dynmat.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    dynmat: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "epsilon.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    dielectric_tensor: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "gw.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    gw_bands_plasmon_pole: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    gw_bands_full_frequency: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "gww.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    gww_simple: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "head.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    head_simple: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "hp.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    hp: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
                supportedApplicationVersions: string[];
            };
            "matdyn.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    matdyn_grid: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    matdyn_path: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "neb.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    neb: {
                        isMultiMaterial: boolean;
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "ph.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    ph_path: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    ph_grid: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    ph_gamma: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    ph_init_qpoints: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    ph_grid_restart: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    ph_single_irr_qpt: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "pp.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    pp_density: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pp_electrostatic_potential: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "projwfc.x": {
                monitors: string[];
                results: string[];
                flavors: {
                    projwfc: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "pw.x": {
                isDefault: boolean;
                hasAdvancedComputeOptions: boolean;
                postProcessors: string[];
                monitors: string[];
                results: string[];
                flavors: {
                    pw_scf: {
                        isDefault: boolean;
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_scf_bands_hse: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_scf_hse: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_scf_kpt_conv: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_scf_dft_u: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+v": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+j": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_legacy: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_magn: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_scf_soc: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_scf_dft_u_magn: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_soc: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+v_magn": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_scf_dft_u+j_magn": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_magn_legacy: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_scf_dft_u_soc_legacy: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_esm: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_esm_relax: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_nscf: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_nscf_magn: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_nscf_soc: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_nscf_dft_u_magn: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_nscf_dft_u+v_magn": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_nscf_dft_u+j_magn": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_dft_u_magn_legacy: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_dft_u_soc: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_nscf_dft_u_soc_legacy: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_bands: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_bands_magn: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_bands_soc: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_bands_dft_u_magn: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_bands_dft_u+v_magn": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    "pw_bands_dft_u+j_magn": {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_dft_u_magn_legacy: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_dft_u_soc: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_bands_dft_u_soc_legacy: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        supportedApplicationVersions: string[];
                    };
                    pw_relax: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pw_vc-relax": {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    pw_md: {
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "pw4gww.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    pw4gww_simple: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "q2r.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    q2r: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "simple.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    simple: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "simple_bse.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    simple_bse: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
            "simple_ip.x": {
                monitors: string[];
                results: never[];
                flavors: {
                    simple_ip: {
                        input: {
                            name: string;
                        }[];
                        results: never[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
        };
        nwchem: {
            nwchem: {
                isDefault: boolean;
                hasAdvancedComputeOptions: boolean;
                postProcessors: string[];
                monitors: string[];
                results: string[];
                flavors: {
                    nwchem_total_energy: {
                        isDefault: boolean;
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
        };
        python: {
            python: {
                isDefault: boolean;
                monitors: string[];
                results: string[];
                flavors: {
                    hello_world: {
                        isDefault: boolean;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    espresso_xml_get_qpt_irr: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    espresso_extract_kpoints: {
                        input: ({
                            name: string;
                            templateName?: undefined;
                        } | {
                            name: string;
                            templateName: string;
                        })[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "generic:post_processing:plot:matplotlib": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "generic:processing:find_extrema:scipy": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:setup_variables_packages": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:custom": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:data_input:read_csv:pandas": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:data_input:train_test_split:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:pre_processing:min_max_scaler:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:pre_processing:remove_duplicates:pandas": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:pre_processing:remove_missing:pandas": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:pre_processing:standardization:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:adaboosted_trees_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:bagged_trees_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:gradboosted_trees_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:extreme_gradboosted_trees_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:k_means_clustering:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:kernel_ridge_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:lasso_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:multilayer_perceptron:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:random_forest_classification:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:gradboosted_trees_classification:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:extreme_gradboosted_trees_classification:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:random_forest_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:model:ridge_regression:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:post_processing:parity_plot:matplotlib": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:post_processing:pca_2d_clusters:matplotlib": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    "pyml:post_processing:roc_curve:sklearn": {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
            };
        };
        vasp: {
            vasp: {
                isDefault: boolean;
                postProcessors: string[];
                monitors: string[];
                results: string[];
                flavors: {
                    vasp: {
                        isDefault: boolean;
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_symprec: {
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_bands: {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_nscf: {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_hse: {
                        isDefault: boolean;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_bands_hse: {
                        isDefault: boolean;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_nscf_hse: {
                        isDefault: boolean;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_relax: {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        postProcessors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_vc_relax: {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        postProcessors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_zpe: {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_kpt_conv: {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_vc_relax_conv: {
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_neb: {
                        isMultiMaterial: boolean;
                        input: {
                            name: string;
                            templateName: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_neb_initial: {
                        isMultiMaterial: boolean;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                    vasp_neb_final: {
                        isMultiMaterial: boolean;
                        input: ({
                            name: string;
                            templateName: string;
                        } | {
                            name: string;
                            templateName?: undefined;
                        })[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                    };
                };
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
