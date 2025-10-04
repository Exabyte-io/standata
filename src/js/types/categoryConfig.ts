/**
 * Configuration for category extraction and preservation scripts
 */

export interface CategoryConfig {
    categoriesPath: string;
    dataPath: string;
    applicationKey: string;
    propertiesKey: string;
    extractFromSubworkflows: boolean;
    defaultMaterialCount: string;
    autoExtractedCategories: string[];
}

export interface CategoryData {
    application: Set<string>;
    property: Set<string>;
    material_count: Set<string>;
}

export interface EntityData {
    filename: string;
    categories: string[];
}
