/**
 * Centralized configuration for build process file names and paths
 * This ensures consistency across all build scripts and makes renaming easier
 *
 * Structure Convention:
 * --------------------
 * Top-level folders organize by purpose:
 * - sources/     YAML source files that define entities (human-editable, version-controlled)
 * - scripts/     Build scripts for generating entities
 * - data/        Individual JSON files generated from sources (one file per entity)
 * - build/standata/  Aggregated JSON maps and build artifacts (git-ignored, for runtime consumption)
 *
 * Each entity type (models, methods, applications, workflows, materials, properties) has subdirectories within these top-level folders.
 *
 * Example flow:
 *   sources/models/*.yml  →  [scripts/models/build_*.ts]  →  data/models/*.json  →  [copied to]  →  dist/js/runtime_data/
 *                                                          →  build/standata/models/*.json  →  [copied to]  →  dist/js/runtime_data/
 */

const BUILD_CONFIG = {
    models: {
        sources: {
            path: "sources/models",
            modelMethodMap: "modelMethodMap.yml",
            categories: "categories.yml",
        },
        data: {
            path: "data/models",
        },
        build: {
            path: "build/standata/models",
            modelMethodMap: "modelMethodMap.json",
        },
    },

    methods: {
        sources: {
            path: "sources/methods",
            categories: "categories.yml",
        },
        data: {
            path: "data/methods",
        },
        build: {
            path: "build/standata/methods",
        },
    },

    applications: {
        sources: {
            path: "sources/applications",
            templates: "templates/templates.yml",
            applicationData: "applications/application_data.yml",
            executableTree: "executables/tree.yml",
            applications: "applications",
            models: "models",
            methods: "methods",
            assets: "assets",
            categories: "categories.yml",
        },
        data: {
            path: "data/applications",
        },
        build: {
            path: "build/standata/applications",
            templatesList: "templatesList.json",
            applicationVersionsMapByApplication: "applicationVersionsMapByApplication.json",
            executableFlavorMapByApplication: "executableFlavorMapByApplication.json",
            modelMethodMapByApplication: "modelMethodMapByApplication.json",
        },
    },

    workflows: {
        sources: {
            path: "sources/workflows",
            workflows: "workflows",
            subworkflows: "subworkflows",
            workflowsCategories: "workflows/categories.yml",
            subworkflowsCategories: "subworkflows/categories.yml",
        },
        data: {
            path: "data/workflows",
            workflows: "workflows",
            subworkflows: "subworkflows",
        },
        build: {
            path: "build/standata/workflows",
            workflowSubforkflowMapByApplication: "workflowSubforkflowMapByApplication.json",
        },
    },

    materials: {
        sources: {
            path: "sources/materials",
            manifest: "manifest.yml",
            categories: "categories.yml",
        },
        data: {
            path: "data/materials",
        },
    },

    properties: {
        sources: {
            path: "sources/properties",
            categories: "categories.yml",
        },
        data: {
            path: "data/properties",
        },
    },

    scripts: {
        models: "scripts/models",
        methods: "scripts/methods",
        applications: "scripts/applications",
        workflows: "scripts/workflows",
    },

    runtimeDataDir: "./dist/js/runtime_data",
};

module.exports = BUILD_CONFIG;
