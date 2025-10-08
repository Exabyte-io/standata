import * as lodash from "lodash";
import * as path from "path";

import { findFiles, readJsonFile, writeYamlFile } from "./utils";

export interface CategorizerConfig {
    dataPath: string;
    categoriesPath: string;
    categoryPaths: string[];
    valueMap?: Record<string, string>;
}

interface CategoryData {
    [key: string]: Set<string>;
}

interface EntityData {
    filename: string;
    categories: string[];
}

/**
 * Base class for extracting categories from JSON entity files to create categories.yml.
 *
 * Features:
 * - Reads JSON files from data directory
 * - Traverses entities using lodash paths (e.g., "categories.type", "units.properties")
 * - Collects unique values for each category path
 * - Optional value mapping for human-readable names (e.g., "qm" → "quantum mechanics")
 * - Generates categories.yml with all unique values and entity mappings
 *
 * Usage:
 *   const categorizer = new BaseCategorizer({
 *     dataPath: 'data/methods',
 *     categoriesPath: 'assets/methods/categories.yml',
 *     categoryPaths: ['categories.tier1', 'categories.type', 'tags'],
 *     valueMap: { 'qm': 'quantum mechanics', 'cg': 'conjugate gradient' }
 *   });
 *   categorizer.build();
 */
export class BaseCategorizer {
    protected config: CategorizerConfig;

    protected categoryData: CategoryData;

    protected entities: EntityData[];

    constructor(config: CategorizerConfig) {
        this.config = config;
        this.categoryData = {};
        this.entities = [];
        this.initializeCategorySets();
    }

    /**
     * Initialize empty Sets for each category key to collect unique values.
     * Extracts the final segment from each path (e.g., "categories.type" → "type").
     */
    protected initializeCategorySets(): void {
        this.config.categoryPaths.forEach((categoryPath) => {
            const categoryKey = this.extractCategoryKeyFromPath(categoryPath);
            this.categoryData[categoryKey] = new Set();
        });
    }

    /**
     * Extract the category key from a lodash path.
     * Example: "categories.type" → "type", "tags" → "tags"
     */
    protected extractCategoryKeyFromPath(categoryPath: string): string {
        const pathSegments = categoryPath.split(".");
        return pathSegments[pathSegments.length - 1];
    }

    /**
     * Transform a value using the optional value map.
     * Example: "qm" → "quantum mechanics" (if mapping exists)
     * Returns original value if no mapping found.
     */
    protected transformValueToHumanReadable(value: string): string {
        if (!this.config.valueMap) return value;
        return this.config.valueMap[value] || value;
    }

    /**
     * Extract and store unique category values from an object at a specific path.
     * Handles both single values and arrays of values.
     * Applies human-readable transformation to extracted values.
     *
     * Example:
     *   path: "categories.type", value: "qm" → stores "quantum mechanics" in categoryData["type"]
     *   path: "tags", value: ["tag1", "tag2"] → stores both in categoryData["tags"]
     */
    protected addUniqueValuesFromPath(obj: any, categoryPath: string): void {
        const categoryKey = this.extractCategoryKeyFromPath(categoryPath);
        const rawValue = lodash.get(obj, categoryPath);

        if (rawValue === undefined || rawValue === null) return;

        if (Array.isArray(rawValue)) {
            rawValue.forEach((item) => {
                if (typeof item === "string") {
                    const transformedValue = this.transformValueToHumanReadable(item);
                    this.categoryData[categoryKey].add(transformedValue);
                }
            });
        } else if (typeof rawValue === "string") {
            const transformedValue = this.transformValueToHumanReadable(rawValue);
            this.categoryData[categoryKey].add(transformedValue);
        }
    }

    /**
     * Collect all category values that apply to a single entity.
     * Returns sorted array of unique category values for this entity.
     *
     * Example:
     *   entity with categories.type="qm" and tags=["tag1"]
     *   → ["quantum mechanics", "tag1"]
     */
    protected collectCategoryValuesForEntity(entity: any): string[] {
        const categoryValues = new Set<string>();

        this.config.categoryPaths.forEach((categoryPath) => {
            const rawValue = lodash.get(entity, categoryPath);

            if (rawValue === undefined || rawValue === null) return;

            if (Array.isArray(rawValue)) {
                rawValue.forEach((item) => {
                    if (typeof item === "string") {
                        const transformedValue = this.transformValueToHumanReadable(item);
                        categoryValues.add(transformedValue);
                    }
                });
            } else if (typeof rawValue === "string") {
                const transformedValue = this.transformValueToHumanReadable(rawValue);
                categoryValues.add(transformedValue);
            }
        });

        return Array.from(categoryValues).sort();
    }

    /**
     * Process a single JSON entity file:
     * 1. Extract unique category values and add to global categoryData
     * 2. Collect category values specific to this entity
     * 3. Store entity with its categories for later YAML generation
     */
    protected processEntityJsonFile(filePath: string): void {
        try {
            const entityData = readJsonFile(filePath);

            // Add unique values to global category sets
            this.config.categoryPaths.forEach((categoryPath) => {
                this.addUniqueValuesFromPath(entityData, categoryPath);
            });

            // Collect categories for this specific entity
            const relativeFilePath = path.relative(this.config.dataPath, filePath);
            const entityCategories = this.collectCategoryValuesForEntity(entityData);

            if (entityCategories.length > 0) {
                this.entities.push({
                    filename: relativeFilePath,
                    categories: entityCategories,
                });
            }
        } catch (error: any) {
            console.error(`Error processing ${filePath}: ${error.message}`);
        }
    }

    /**
     * Build the final YAML data structure:
     * - categories: All unique values organized by category key
     * - entities: List of entities with their applicable categories
     *
     * Example output:
     * {
     *   categories: {
     *     tier1: ["quantum mechanics", "optimization"],
     *     tags: ["tag1", "tag2"]
     *   },
     *   entities: [
     *     { filename: "entity1.json", categories: ["quantum mechanics", "tag1"] }
     *   ]
     * }
     */
    protected buildCategoriesYamlStructure(): any {
        const categoriesByKey: Record<string, string[]> = {};

        // Convert Sets to sorted arrays
        Object.keys(this.categoryData).forEach((categoryKey) => {
            const uniqueValues = Array.from(this.categoryData[categoryKey]).sort();
            if (uniqueValues.length > 0) {
                categoriesByKey[categoryKey] = uniqueValues;
            }
        });

        // Sort entities by filename
        const sortedEntities = this.entities
            .sort((a, b) => a.filename.localeCompare(b.filename))
            .map((entity) => ({
                filename: entity.filename,
                categories: entity.categories,
            }));

        return {
            categories: categoriesByKey,
            entities: sortedEntities,
        };
    }

    /**
     * Scan all JSON files in data directory and extract category information.
     * Populates categoryData (unique values) and entities (per-entity categories).
     */
    public extractCategoriesFromJsonFiles(): void {
        const jsonFiles = findFiles(this.config.dataPath, [".json"]);
        jsonFiles.forEach((file) => this.processEntityJsonFile(file));
        console.log(`Processed ${jsonFiles.length} JSON files`);
    }

    /**
     * Write the collected category data to categories.yml file.
     * Includes all unique category values and entity mappings.
     */
    public writeCategoriesYamlFile(): void {
        const yamlStructure = this.buildCategoriesYamlStructure();
        writeYamlFile(this.config.categoriesPath, yamlStructure);
        console.log(`\nCategories file written to: ${this.config.categoriesPath}`);
        console.log(`  - ${Object.keys(yamlStructure.categories).length} category types`);
        console.log(`  - ${yamlStructure.entities.length} entities`);
    }

    /**
     * Main entry point: Extract categories from JSON files and write to YAML.
     * This is the method you call to generate categories.yml.
     */
    public build(): void {
        this.extractCategoriesFromJsonFiles();
        this.writeCategoriesYamlFile();
    }
}
