/**
 * Centralized configuration for build process file names and paths
 * This ensures consistency across all build scripts and makes renaming easier
 */

const BUILD_CONFIG = {
    models: {
        sources: {
            path: "models/sources",
            modelMethodMap: "modelMethodMap.yml",
        },
        data: {
            path: "models/data",
        },
        build: {
            path: "models/build",
            modelMethodMap: "modelMethodMap.json",
        },
        categories: {
            path: "models/data/categories.yml",
        },
    },

    methods: {
        sources: {
            path: "methods/sources",
        },
        data: {
            path: "methods/data",
        },
        build: {
            path: "methods/build",
        },
        categories: {
            path: "methods/data/categories.yml",
        },
    },

    applications: {
        templatesList: "templatesList.json",
        applicationVersionsMapByApplication: "applicationVersionsMapByApplication.json",
        executableFlavorMapByApplication: "executableFlavorMapByApplication.json",
        modelMethodMapByApplication: "modelMethodMapByApplication.json",
    },

    workflows: {
        workflowSubforkflowMapByApplication: "workflowSubforkflowMapByApplication.json",
    },

    runtimeDataDir: "./dist/js/runtime_data",

    sources: {
        templates: "templates/templates.yml",
        applicationData: "applications/application_data.yml",
        executableTree: "executables/tree.yml",
    },

    categories: {
        materials: "./materials/categories.yml",
        properties: "./properties/categories.yml",
        applications: "./applications/data/categories.yml",
        workflows: "./workflows/workflows/categories.yml",
        subworkflows: "./workflows/subworkflows/categories.yml",
    },
};

module.exports = BUILD_CONFIG;
