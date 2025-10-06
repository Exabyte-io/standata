/**
 * Centralized configuration for build process file names and paths
 * This ensures consistency across all build scripts and makes renaming easier
 *
 * Structure Convention:
 * --------------------
 * Each entity type (models, methods, applications, workflows) follows this pattern:
 *
 * - sources:     YAML source files that define entities (human-editable, version-controlled)
 * - data:        Individual JSON files generated from sources (one file per entity)
 * - build:       Aggregated JSON maps and build artifacts (for runtime consumption)
 * - categories:  YAML files mapping entities to their category taxonomies
 *
 * Example flow:
 *   sources/*.yml  →  [build script]  →  data/*.json  →  [copied to]  →  dist/js/runtime_data/
 *                                     →  build/*.json  →  [copied to]  →  dist/js/runtime_data/
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
        sources: {
            path: "applications/sources",
            templates: "templates/templates.yml",
            applicationData: "applications/application_data.yml",
            executableTree: "executables/tree.yml",
            applications: "applications/sources/applications",
            models: "applications/sources/models",
            methods: "applications/sources/methods",
        },
        data: {
            path: "applications/data",
        },
        build: {
            path: "applications/build",
            templatesList: "templatesList.json",
            applicationVersionsMapByApplication: "applicationVersionsMapByApplication.json",
            executableFlavorMapByApplication: "executableFlavorMapByApplication.json",
            modelMethodMapByApplication: "modelMethodMapByApplication.json",
        },
        categories: {
            path: "applications/data/categories.yml",
        },
    },

    workflows: {
        sources: {
            path: "workflows/sources",
            workflows: "workflows/sources/workflows",
            subworkflows: "workflows/sources/subworkflows",
        },
        data: {
            path: "workflows",
            workflows: "workflows/workflows",
            subworkflows: "workflows/subworkflows",
        },
        build: {
            path: "workflows/build",
            workflowSubforkflowMapByApplication: "workflowSubforkflowMapByApplication.json",
        },
        categories: {
            workflows: "workflows/workflows/categories.yml",
            subworkflows: "workflows/subworkflows/categories.yml",
        },
    },

    // TODO: adapt materials and properties to follow the same structure convention
    materials: {
        sources: {
            path: "materials/sources",
            manifest: "materials/sources/manifest.yml",
        },
        data: {
            path: "materials", // JSON files directly in materials/ directory
        },
        categories: {
            path: "materials/categories.yml",
        },
    },

    properties: {
        data: {
            path: "properties", // JSON files directly in properties/ directory
        },
        categories: {
            path: "properties/categories.yml",
        },
    },

    runtimeDataDir: "./dist/js/runtime_data",
};

module.exports = BUILD_CONFIG;
