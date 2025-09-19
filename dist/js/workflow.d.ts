import { Standata } from "./base";
import workflowSubforkflowMapByApplication from "./runtime_data/workflowSubforkflowMapByApplication.json";
export declare class WorkflowStandata extends Standata {
    static runtimeData: {
        standataConfig: {
            categories: {
                application: string[];
                property: string[];
                material_count: string[];
                workflow_type: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "espresso_total_energy.json": {
                name: string;
                subworkflows: {
                    _id: string;
                    name: string;
                    application: {
                        name: string;
                        shortName: string;
                        summary: string;
                        build: string;
                        version: string;
                        isDefault: boolean;
                        hasAdvancedComputeOptions: boolean;
                        schemaVersion: string;
                    };
                    properties: string[];
                    model: {
                        type: string;
                        subtype: string;
                        method: {
                            type: string;
                            subtype: string;
                            data: {};
                        };
                        functional: {
                            slug: string;
                        };
                        refiners: never[];
                        modifiers: never[];
                    };
                    units: {
                        type: string;
                        name: string;
                        head: boolean;
                        results: {
                            name: string;
                        }[];
                        monitors: {
                            name: string;
                        }[];
                        flowchartId: string;
                        preProcessors: never[];
                        postProcessors: never[];
                        application: {
                            name: string;
                            shortName: string;
                            summary: string;
                            build: string;
                            version: string;
                            isDefault: boolean;
                            hasAdvancedComputeOptions: boolean;
                            schemaVersion: string;
                        };
                        executable: {
                            isDefault: boolean;
                            hasAdvancedComputeOptions: boolean;
                            postProcessors: string[];
                            monitors: string[];
                            results: string[];
                            name: string;
                            schemaVersion: string;
                        };
                        flavor: {
                            isDefault: boolean;
                            input: {
                                name: string;
                            }[];
                            results: string[];
                            monitors: string[];
                            applicationName: string;
                            executableName: string;
                            name: string;
                            schemaVersion: string;
                        };
                        status: string;
                        statusTrack: never[];
                        tags: never[];
                        input: {
                            content: string;
                            name: string;
                            contextProviders: {
                                name: string;
                            }[];
                            applicationName: string;
                            executableName: string;
                            rendered: string;
                            schemaVersion: string;
                        }[];
                    }[];
                }[];
                units: {
                    name: string;
                    type: string;
                    _id: string;
                    status: string;
                    statusTrack: never[];
                    flowchartId: string;
                    tags: never[];
                    head: boolean;
                }[];
                properties: string[];
                workflows: never[];
                schemaVersion: string;
                isDefault: boolean;
            };
            "espresso_variable_cell_relaxation.json": {
                name: string;
                subworkflows: {
                    systemName: string;
                    _id: string;
                    name: string;
                    application: {
                        name: string;
                        shortName: string;
                        summary: string;
                        build: string;
                        version: string;
                        isDefault: boolean;
                        hasAdvancedComputeOptions: boolean;
                        schemaVersion: string;
                    };
                    properties: string[];
                    model: {
                        type: string;
                        subtype: string;
                        method: {
                            type: string;
                            subtype: string;
                            data: {};
                        };
                        functional: {
                            slug: string;
                        };
                        refiners: never[];
                        modifiers: never[];
                    };
                    units: {
                        type: string;
                        name: string;
                        head: boolean;
                        results: {
                            name: string;
                        }[];
                        monitors: {
                            name: string;
                        }[];
                        flowchartId: string;
                        preProcessors: never[];
                        postProcessors: never[];
                        application: {
                            name: string;
                            shortName: string;
                            summary: string;
                            build: string;
                            version: string;
                            isDefault: boolean;
                            hasAdvancedComputeOptions: boolean;
                            schemaVersion: string;
                        };
                        executable: {
                            isDefault: boolean;
                            hasAdvancedComputeOptions: boolean;
                            postProcessors: string[];
                            monitors: string[];
                            results: string[];
                            name: string;
                            schemaVersion: string;
                        };
                        flavor: {
                            input: {
                                name: string;
                            }[];
                            monitors: string[];
                            results: string[];
                            applicationName: string;
                            executableName: string;
                            name: string;
                            schemaVersion: string;
                            isDefault: boolean;
                        };
                        status: string;
                        statusTrack: never[];
                        tags: never[];
                        input: {
                            content: string;
                            name: string;
                            contextProviders: {
                                name: string;
                            }[];
                            applicationName: string;
                            executableName: string;
                            rendered: string;
                            schemaVersion: string;
                        }[];
                    }[];
                }[];
                units: {
                    name: string;
                    type: string;
                    _id: string;
                    status: string;
                    statusTrack: never[];
                    flowchartId: string;
                    tags: never[];
                    head: boolean;
                }[];
                properties: string[];
                workflows: never[];
                schemaVersion: string;
                isDefault: boolean;
            };
        };
    };
    findByApplication(appName: string): object[];
    findByApplicationAndName(appName: string, displayName: string): object | undefined;
    getRelaxationWorkflowByApplication(appName: string): object | undefined;
    getDefault(): object;
}
export declare class SubworkflowStandata extends Standata {
    static runtimeData: {
        standataConfig: {
            categories: {
                application: string[];
                property: string[];
                material_count: string[];
                subworkflow_type: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "espresso_subworkflow_total_energy.json": {
                _id: string;
                name: string;
                application: {
                    name: string;
                    shortName: string;
                    summary: string;
                    build: string;
                    version: string;
                    isDefault: boolean;
                    hasAdvancedComputeOptions: boolean;
                    schemaVersion: string;
                };
                properties: string[];
                model: {
                    type: string;
                    subtype: string;
                    method: {
                        type: string;
                        subtype: string;
                        data: {};
                    };
                    functional: {
                        slug: string;
                    };
                    refiners: never[];
                    modifiers: never[];
                };
                units: {
                    type: string;
                    name: string;
                    head: boolean;
                    results: {
                        name: string;
                    }[];
                    monitors: {
                        name: string;
                    }[];
                    flowchartId: string;
                    preProcessors: never[];
                    postProcessors: never[];
                    application: {
                        name: string;
                        shortName: string;
                        summary: string;
                        build: string;
                        version: string;
                        isDefault: boolean;
                        hasAdvancedComputeOptions: boolean;
                        schemaVersion: string;
                    };
                    executable: {
                        isDefault: boolean;
                        hasAdvancedComputeOptions: boolean;
                        postProcessors: string[];
                        monitors: string[];
                        results: string[];
                        name: string;
                        schemaVersion: string;
                    };
                    flavor: {
                        isDefault: boolean;
                        input: {
                            name: string;
                        }[];
                        results: string[];
                        monitors: string[];
                        applicationName: string;
                        executableName: string;
                        name: string;
                        schemaVersion: string;
                    };
                    status: string;
                    statusTrack: never[];
                    tags: never[];
                    input: {
                        content: string;
                        name: string;
                        contextProviders: {
                            name: string;
                        }[];
                        applicationName: string;
                        executableName: string;
                        rendered: string;
                        schemaVersion: string;
                    }[];
                }[];
            };
            "espresso_subworkflow_variable_cell_relaxation.json": {
                systemName: string;
                _id: string;
                name: string;
                application: {
                    name: string;
                    shortName: string;
                    summary: string;
                    build: string;
                    version: string;
                    isDefault: boolean;
                    hasAdvancedComputeOptions: boolean;
                    schemaVersion: string;
                };
                properties: string[];
                model: {
                    type: string;
                    subtype: string;
                    method: {
                        type: string;
                        subtype: string;
                        data: {};
                    };
                    functional: {
                        slug: string;
                    };
                    refiners: never[];
                    modifiers: never[];
                };
                units: {
                    type: string;
                    name: string;
                    head: boolean;
                    results: {
                        name: string;
                    }[];
                    monitors: {
                        name: string;
                    }[];
                    flowchartId: string;
                    preProcessors: never[];
                    postProcessors: never[];
                    application: {
                        name: string;
                        shortName: string;
                        summary: string;
                        build: string;
                        version: string;
                        isDefault: boolean;
                        hasAdvancedComputeOptions: boolean;
                        schemaVersion: string;
                    };
                    executable: {
                        isDefault: boolean;
                        hasAdvancedComputeOptions: boolean;
                        postProcessors: string[];
                        monitors: string[];
                        results: string[];
                        name: string;
                        schemaVersion: string;
                    };
                    flavor: {
                        input: {
                            name: string;
                        }[];
                        monitors: string[];
                        results: string[];
                        applicationName: string;
                        executableName: string;
                        name: string;
                        schemaVersion: string;
                        isDefault: boolean;
                    };
                    status: string;
                    statusTrack: never[];
                    tags: never[];
                    input: {
                        content: string;
                        name: string;
                        contextProviders: {
                            name: string;
                        }[];
                        applicationName: string;
                        executableName: string;
                        rendered: string;
                        schemaVersion: string;
                    }[];
                }[];
            };
        };
    };
}
export { workflowSubforkflowMapByApplication };
