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
            "total_energy.json": {
                _id: string;
                name: string;
                subworkflows: {
                    _id: string;
                    name: string;
                    application: {
                        _id: string;
                        name: string;
                        version: string;
                        build: string;
                        isDefault: boolean;
                        summary: string;
                        updatedAt: string;
                        shortName: string;
                        hasAdvancedComputeOptions: boolean;
                        updatedBy: string;
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
                            _id: string;
                            name: string;
                            version: string;
                            build: string;
                            isDefault: boolean;
                            summary: string;
                            updatedAt: string;
                            shortName: string;
                            hasAdvancedComputeOptions: boolean;
                            updatedBy: string;
                        };
                        executable: {
                            isDefault: boolean;
                            hasAdvancedComputeOptions: boolean;
                            postProcessors: string[];
                            monitors: string[];
                            results: string[];
                            name: string;
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
                            executable: {
                                isDefault: boolean;
                                hasAdvancedComputeOptions: boolean;
                                postProcessors: string[];
                                monitors: string[];
                                results: string[];
                                name: string;
                            };
                        };
                        status: string;
                        statusTrack: never[];
                        input: {
                            content: string;
                            name: string;
                            contextProviders: {
                                name: string;
                            }[];
                            applicationName: string;
                            executableName: string;
                            updatedAt: string;
                            updatedBy: string;
                            rendered: string;
                        }[];
                    }[];
                    compute: null;
                    isDraft: boolean;
                }[];
                units: {
                    name: string;
                    type: string;
                    _id: string;
                    flowchartId: string;
                    status: string;
                    statusTrack: never[];
                    results: never[];
                    monitors: never[];
                    preProcessors: never[];
                    postProcessors: never[];
                    head: boolean;
                    schemaVersion: string;
                    isDefault: boolean;
                }[];
                properties: string[];
                isDefault: boolean;
                hash: string;
                isOutdated: boolean;
                createdAt: string;
                updatedAt: string;
                workflows: never[];
                schemaVersion: string;
                tags: never[];
                owner: {
                    _id: string;
                    slug: string;
                    cls: string;
                };
                creator: {
                    _id: string;
                    slug: string;
                    cls: string;
                };
                compute: null;
                exabyteId: string;
                isEntitySet: boolean;
            };
            "band_gap.json": {
                _id: string;
                name: string;
                subworkflows: {
                    _id: string;
                    name: string;
                    application: {
                        _id: string;
                        name: string;
                        version: string;
                        build: string;
                        isDefault: boolean;
                        summary: string;
                        updatedAt: string;
                        shortName: string;
                        isLicensed: boolean;
                        updatedBy: string;
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
                    };
                    units: ({
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
                            _id: string;
                            name: string;
                            version: string;
                            build: string;
                            isDefault: boolean;
                            summary: string;
                            updatedAt: string;
                            shortName: string;
                            isLicensed: boolean;
                            updatedBy: string;
                        };
                        executable: {
                            isDefault: boolean;
                            postProcessors: string[];
                            monitors: string[];
                            results: string[];
                            name: string;
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
                            executable: {
                                isDefault: boolean;
                                postProcessors: string[];
                                monitors: string[];
                                results: string[];
                                name: string;
                            };
                        };
                        status: string;
                        statusTrack: never[];
                        input: {
                            content: string;
                            name: string;
                            contextProviders: {
                                name: string;
                            }[];
                            applicationName: string;
                            executableName: string;
                            updatedAt: string;
                            updatedBy: string;
                            rendered: string;
                        }[];
                        next: string;
                    } | {
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
                            _id: string;
                            name: string;
                            version: string;
                            build: string;
                            isDefault: boolean;
                            summary: string;
                            updatedAt: string;
                            shortName: string;
                            isLicensed: boolean;
                            updatedBy: string;
                        };
                        executable: {
                            isDefault: boolean;
                            postProcessors: string[];
                            monitors: string[];
                            results: string[];
                            name: string;
                        };
                        flavor: {
                            input: {
                                name: string;
                                templateName: string;
                            }[];
                            results: string[];
                            monitors: string[];
                            applicationName: string;
                            executableName: string;
                            name: string;
                            executable: {
                                isDefault: boolean;
                                postProcessors: string[];
                                monitors: string[];
                                results: string[];
                                name: string;
                            };
                            isDefault?: undefined;
                        };
                        status: string;
                        statusTrack: never[];
                        input: {
                            content: string;
                            name: string;
                            contextProviders: {
                                name: string;
                            }[];
                            applicationName: string;
                            executableName: string;
                            updatedAt: string;
                            updatedBy: string;
                            rendered: string;
                        }[];
                        next?: undefined;
                    })[];
                    compute: null;
                    isDraft: boolean;
                }[];
                units: {
                    name: string;
                    type: string;
                    _id: string;
                    flowchartId: string;
                    status: string;
                    statusTrack: never[];
                    results: never[];
                    monitors: never[];
                    preProcessors: never[];
                    postProcessors: never[];
                    head: boolean;
                    schemaVersion: string;
                    isDefault: boolean;
                }[];
                properties: string[];
                hash: string;
                isOutdated: boolean;
                workflows: never[];
                schemaVersion: string;
                tags: never[];
                owner: {
                    _id: string;
                    slug: string;
                    cls: string;
                };
                creator: {
                    _id: string;
                    slug: string;
                    cls: string;
                };
                compute: null;
                exabyteId: string;
                isDefault: boolean;
                isEntitySet: boolean;
                createdAt: string;
                createdBy: string;
                updatedAt: string;
                updatedBy: string;
            };
        };
    };
}
