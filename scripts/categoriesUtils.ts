import * as lodash from "lodash";
import * as path from "path";

import { findFiles, readJsonFile, writeYamlFile } from "./utils";

export interface CategoriesConfig {
    dataPath: string;
    categoriesYamlFilePath: string;
    categoryPathsInEntity: string[];
    shortToHumanReadableValueMap?: Record<string, string>;
}

interface CategoryData {
    [key: string]: Set<string>;
}

interface EntityCategories {
    filename: string;
    categories: string[];
}

/**
 * Extracts the final segment from a path (e.g., "categories.type" → "type").
 */
function getCategoryKey(categoryPath: string): string {
    const segments = categoryPath.split(".");
    return segments[segments.length - 1];
}

/**
 * Transforms a value to human-readable format using the value map.
 */
function transformValue(value: string, valueMap?: Record<string, string>): string {
    return valueMap?.[value] ?? value;
}

/**
 * Adds string values to a category set, applying transformation if needed.
 */
function addValuesToCategory(
    values: any,
    categoryKey: string,
    categoryData: CategoryData,
    valueMap?: Record<string, string>,
): void {
    const valueArray = Array.isArray(values) ? values : [values];
    valueArray.forEach((item) => {
        if (typeof item === "string") {
            categoryData[categoryKey].add(transformValue(item, valueMap));
        }
    });
}

/**
 * Extracts values from units array for a given path.
 */
function extractFromUnits(
    units: any[],
    categoryPath: string,
    categoryKey: string,
    categoryData: CategoryData,
    valueMap?: Record<string, string>,
): void {
    units.forEach((unit: any) => {
        const value = lodash.get(unit, categoryPath);
        if (value !== undefined && value !== null) {
            addValuesToCategory(value, categoryKey, categoryData, valueMap);
        }
    });
}

/**
 * Extracts values from object at path and from units array if present.
 */
function extractAndAddValues(
    object: any,
    categoryPath: string,
    categoryKey: string,
    categoryData: CategoryData,
    valueMap?: Record<string, string>,
): void {
    const value = lodash.get(object, categoryPath);
    if (value !== undefined && value !== null) {
        addValuesToCategory(value, categoryKey, categoryData, valueMap);
    }

    if (Array.isArray(object.units)) {
        extractFromUnits(object.units, categoryPath, categoryKey, categoryData, valueMap);
    }
}

/**
 * Adds values from a path to the categories set.
 */
function addCategoriesToSet(
    value: any,
    categories: Set<string>,
    valueMap?: Record<string, string>,
): void {
    const values = Array.isArray(value) ? value : [value];
    values.forEach((item) => {
        if (typeof item === "string") {
            categories.add(transformValue(item, valueMap));
        }
    });
}

/**
 * Collects categories from units array for a given path.
 */
function collectFromUnits(
    units: any[],
    categoryPath: string,
    categories: Set<string>,
    valueMap?: Record<string, string>,
): void {
    units.forEach((unit: any) => {
        const value = lodash.get(unit, categoryPath);
        if (value !== undefined && value !== null) {
            addCategoriesToSet(value, categories, valueMap);
        }
    });
}

/**
 * Collects all category values from an entity and its units.
 */
function collectEntityCategories(
    entity: any,
    categoryPaths: string[],
    valueMap?: Record<string, string>,
): string[] {
    const categories = new Set<string>();

    categoryPaths.forEach((categoryPath) => {
        const value = lodash.get(entity, categoryPath);
        if (value !== undefined && value !== null) {
            addCategoriesToSet(value, categories, valueMap);
        }

        if (Array.isArray(entity.units)) {
            collectFromUnits(entity.units, categoryPath, categories, valueMap);
        }
    });

    return Array.from(categories).sort();
}

/**
 * Extracts categories from all paths in an entity.
 */
function extractAllCategories(
    entity: any,
    categoryPaths: string[],
    categoryData: CategoryData,
    valueMap?: Record<string, string>,
): void {
    categoryPaths.forEach((categoryPath) => {
        const categoryKey = getCategoryKey(categoryPath);
        extractAndAddValues(entity, categoryPath, categoryKey, categoryData, valueMap);
    });
}

/**
 * Processes a single JSON file and extracts category information.
 */
function processJsonFile(
    filePath: string,
    dataPath: string,
    categoryPaths: string[],
    categoryData: CategoryData,
    valueMap?: Record<string, string>,
): EntityCategories | null {
    try {
        const entity = readJsonFile(filePath);
        extractAllCategories(entity, categoryPaths, categoryData, valueMap);
        const categories = collectEntityCategories(entity, categoryPaths, valueMap);

        return categories.length > 0
            ? { filename: path.relative(dataPath, filePath), categories }
            : null;
    } catch (error: any) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * Builds the categories YAML structure with all unique values and entity mappings.
 */
function buildCategoriesYaml(categoryData: CategoryData, entities: EntityCategories[]): any {
    const categories: Record<string, string[]> = {};

    Object.keys(categoryData).forEach((key) => {
        const values = Array.from(categoryData[key]).sort();
        if (values.length > 0) {
            categories[key] = values;
        }
    });

    const sortedEntities = entities.sort((a, b) => a.filename.localeCompare(b.filename));

    return { categories, entities: sortedEntities };
}

/**
 * Initializes empty category sets for all category paths.
 */
function initializeCategoryData(categoryPaths: string[]): CategoryData {
    const categoryData: CategoryData = {};
    categoryPaths.forEach((categoryPath) => {
        categoryData[getCategoryKey(categoryPath)] = new Set();
    });
    return categoryData;
}

/**
 * Generates a categories.yml file from JSON entities.
 */
export function generateCategoriesFile(config: CategoriesConfig): void {
    const categoryData = initializeCategoryData(config.categoryPathsInEntity);
    const jsonFiles = findFiles(config.dataPath, [".json"]);

    const entities = jsonFiles
        .map((filePath) =>
            processJsonFile(
                filePath,
                config.dataPath,
                config.categoryPathsInEntity,
                categoryData,
                config.shortToHumanReadableValueMap,
            ),
        )
        .filter((entity): entity is EntityCategories => entity !== null);

    const yamlStructure = buildCategoriesYaml(categoryData, entities);

    writeYamlFile(config.categoriesYamlFilePath, yamlStructure);

    console.log(`\nCategories file written to: ${config.categoriesYamlFilePath}`);
    console.log(`${Object.keys(yamlStructure.categories).length} category types`);
    console.log(`${yamlStructure.entities.length} entities out of ${jsonFiles.length} JSON files`);
}
