import type { CategoryConfig } from "../../src/js/types/categoryConfig";

/**
 * Configuration for workflow categories generation
 *
 * This config is used by workflows/scripts/create_workflows_categories.ts
 */
export const WORKFLOW_CONFIG: CategoryConfig = {
    categoriesPath: "workflows/workflows/categories.yml",
    dataPath: "workflows/workflows",
    applicationKey: "application",
    propertiesKey: "properties",
    extractFromSubworkflows: true,
    defaultMaterialCount: "single-material",
    // Categories that are auto-extracted from JSON (will be regenerated)
    // All other categories marked with !manually_added tag in YAML will be preserved
    autoExtractedCategories: ["application", "property", "material_count"],
};

/**
 * Configuration for subworkflow categories generation
 *
 * This config is used by workflows/scripts/create_workflows_categories.ts
 */
export const SUBWORKFLOW_CONFIG: CategoryConfig = {
    categoriesPath: "workflows/subworkflows/categories.yml",
    dataPath: "workflows/subworkflows",
    applicationKey: "application",
    propertiesKey: "properties",
    extractFromSubworkflows: false,
    defaultMaterialCount: "single-material",
    // Categories that are auto-extracted from JSON (will be regenerated)
    // All other categories marked with !manually_added tag in YAML will be preserved
    autoExtractedCategories: ["application", "property", "material_count"],
};
