/**
 * Centralized configuration for build process file names and paths
 * This ensures consistency across all build scripts and makes renaming easier
 */

const BUILD_CONFIG = {
    applications: {
        templatesMapByApplication: "templatesMapByApplication.json",
        applicationDataMapByApplication: "applicationDataMapByApplication.json",
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
        applications: "./applications/applications/categories.yml",
        workflows: "./workflows/workflows/categories.yml",
        subworkflows: "./workflows/subworkflows/categories.yml",
    },
};

module.exports = BUILD_CONFIG;
