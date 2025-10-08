import * as lodash from "lodash";
import * as path from "path";

import { findFiles, readJsonFile, writeYamlFile } from "./utils";

export interface CategoriesConfig {
    dataPath: string;
    categoriesPath: string;
    categoryPaths: string[];
    valueMap?: Record<string, string>;
}

/**
 * Human-readable mapping for methods and models shortwords.
 */
export const METHOD_MODEL_VALUE_MAP: Record<string, string> = {
    // Tier1 - Method categories
    qm: "quantum mechanics",
    opt: "optimization",
    linalg: "linear algebra",
    pb: "physics-based",
    st: "statistical",
    mm: "molecular mechanics",

    // Tier2 - Method subcategories
    wf: "wave function",
    diff: "differential",
    diag: "diagonalization",
    det: "deterministic",

    // Tier3 - Detailed method types
    ordern: "order-n",
    dft: "density functional theory",
    abin: "ab initio",
    ml: "machine learning",

    // Types
    psp: "pseudopotential",
    pw: "plane wave",
    smearing: "smearing",
    tetrahedron: "tetrahedron",
    cg: "conjugate gradient",
    ksdft: "Kohn-Sham DFT",
    gw: "GW approximation",
    re: "regression",

    // Subtypes - Pseudopotentials
    nc: "norm conserving",
    us: "ultrasoft",
    paw: "projector augmented wave",
    gaussian: "gaussian smearing",
    linear: "linear",

    // Subtypes - Functionals
    lda: "local density approximation",
    gga: "generalized gradient approximation",
    hybrid: "hybrid functionals",
    g0w0: "G0W0",
    evgw0: "evGW0",
    evgw: "evGW",

    // Functional parameters
    pz: "Perdew-Zunger",
    pbe: "Perdew-Burke-Ernzerhof",
    pbesol: "PBE for solids",
    hse06: "Heyd-Scuseria-Ernzerhof",
    b3lyp: "Becke 3-parameter Lee-Yang-Parr",
};

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
 * Extracts values from an object at a given path and adds them to the category set.
 * Handles both single values and arrays.
 * Also extracts from entity.units array if present (for methods with composite units).
 */
function extractAndAddValues(
    obj: any,
    categoryPath: string,
    categoryKey: string,
    categoryData: CategoryData,
    valueMap?: Record<string, string>,
): void {
    const rawValue = lodash.get(obj, categoryPath);
    if (rawValue !== undefined && rawValue !== null) {
        const values = Array.isArray(rawValue) ? rawValue : [rawValue];
        values.forEach((item) => {
            if (typeof item === "string") {
                categoryData[categoryKey].add(transformValue(item, valueMap));
            }
        });
    }

    if (Array.isArray(obj.units)) {
        obj.units.forEach((unit: any) => {
            const unitValue = lodash.get(unit, categoryPath);
            if (unitValue !== undefined && unitValue !== null) {
                const values = Array.isArray(unitValue) ? unitValue : [unitValue];
                values.forEach((item) => {
                    if (typeof item === "string") {
                        categoryData[categoryKey].add(transformValue(item, valueMap));
                    }
                });
            }
        });
    }
}

/**
 * Collects all category values applicable to a single entity.
 * Also extracts from entity.units array if present (for methods with composite units).
 */
function collectEntityCategories(
    entity: any,
    categoryPaths: string[],
    valueMap?: Record<string, string>,
): string[] {
    const categories = new Set<string>();

    categoryPaths.forEach((categoryPath) => {
        const rawValue = lodash.get(entity, categoryPath);
        if (rawValue !== undefined && rawValue !== null) {
            const values = Array.isArray(rawValue) ? rawValue : [rawValue];
            values.forEach((item) => {
                if (typeof item === "string") {
                    categories.add(transformValue(item, valueMap));
                }
            });
        }

        if (Array.isArray(entity.units)) {
            entity.units.forEach((unit: any) => {
                const unitValue = lodash.get(unit, categoryPath);
                if (unitValue !== undefined && unitValue !== null) {
                    const values = Array.isArray(unitValue) ? unitValue : [unitValue];
                    values.forEach((item) => {
                        if (typeof item === "string") {
                            categories.add(transformValue(item, valueMap));
                        }
                    });
                }
            });
        }
    });

    return Array.from(categories).sort();
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

        categoryPaths.forEach((categoryPath) => {
            const categoryKey = getCategoryKey(categoryPath);
            extractAndAddValues(entity, categoryPath, categoryKey, categoryData, valueMap);
        });

        const categories = collectEntityCategories(entity, categoryPaths, valueMap);
        if (categories.length === 0) return null;

        return {
            filename: path.relative(dataPath, filePath),
            categories,
        };
    } catch (error: any) {
        console.error(`Error processing ${filePath}: ${error.message}`);
        return null;
    }
}

/**
 * Builds the YAML structure with categories and entities.
 */
function buildYamlStructure(categoryData: CategoryData, entities: EntityCategories[]): any {
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
 * Generates a categories.yml file from JSON entities.
 */
export function generateCategoriesFile(config: CategoriesConfig): void {
    const categoryData: CategoryData = {};
    config.categoryPaths.forEach((categoryPath) => {
        categoryData[getCategoryKey(categoryPath)] = new Set();
    });

    const jsonFiles = findFiles(config.dataPath, [".json"]);
    console.log(`Processing ${jsonFiles.length} JSON files...`);

    const entities: EntityCategories[] = [];
    jsonFiles.forEach((filePath) => {
        const entityData = processJsonFile(
            filePath,
            config.dataPath,
            config.categoryPaths,
            categoryData,
            config.valueMap,
        );
        if (entityData) {
            entities.push(entityData);
        }
    });

    const yamlStructure = buildYamlStructure(categoryData, entities);
    writeYamlFile(config.categoriesPath, yamlStructure);

    console.log(`\nCategories file written to: ${config.categoriesPath}`);
    console.log(`  - ${Object.keys(yamlStructure.categories).length} category types`);
    console.log(`  - ${yamlStructure.entities.length} entities`);
}
