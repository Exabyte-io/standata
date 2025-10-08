import { BaseCategorizer, CategorizerConfig } from "./BaseCategorizer";

/**
 * Categorizer for methods and models with human-readable value mapping.
 *
 * Extends BaseCategorizer to handle units (for methods) and provides
 * a mapping of shortwords to human-readable terms.
 *
 * Example mappings:
 * - "qm" → "quantum mechanics"
 * - "cg" → "conjugate gradient"
 * - "dft" → "density functional theory"
 */
export class MethodModelCategorizer extends BaseCategorizer {
    private static VALUE_MAP: Record<string, string> = {
        // Computational methods
        qm: "quantum mechanics",
        mm: "molecular mechanics",
        cg: "conjugate gradient",
        dft: "density functional theory",

        // Functionals
        lda: "local density approximation",
        gga: "generalized gradient approximation",

        // Pseudopotentials
        nc: "norm conserving",
        us: "ultrasoft",
        paw: "projector augmented wave",

        // Add more mappings as needed
    };

    constructor(config: Omit<CategorizerConfig, "valueMap">) {
        super({
            ...config,
            valueMap: MethodModelCategorizer.VALUE_MAP,
        });
    }

    /**
     * Override to handle units array in methods.
     * When a path starts with "units.", extract from both the entity and each unit.
     */
    protected addUniqueValuesFromPath(obj: any, categoryPath: string): void {
        super.addUniqueValuesFromPath(obj, categoryPath);

        if (categoryPath.startsWith("units.")) {
            const { units } = obj;
            if (Array.isArray(units)) {
                const unitCategoryPath = categoryPath.replace("units.", "");
                units.forEach((unit: any) => {
                    super.addUniqueValuesFromPath(unit, unitCategoryPath);
                });
            }
        }
    }

    /**
     * Override to collect categories from units array (for methods).
     * Extracts categories from both the entity itself and all units.
     */
    protected collectCategoryValuesForEntity(entity: any): string[] {
        const categoryValues = super.collectCategoryValuesForEntity(entity);

        if (entity.units && Array.isArray(entity.units)) {
            entity.units.forEach((unit: any) => {
                this.config.categoryPaths.forEach((categoryPath) => {
                    const unitCategoryPath = categoryPath.replace("units.", "");
                    const rawValue = unit[unitCategoryPath] || unit.categories?.[unitCategoryPath];

                    if (rawValue === undefined || rawValue === null) return;

                    if (Array.isArray(rawValue)) {
                        rawValue.forEach((item) => {
                            if (typeof item === "string") {
                                const transformedValue = this.transformValueToHumanReadable(item);
                                categoryValues.push(transformedValue);
                            }
                        });
                    } else if (typeof rawValue === "string") {
                        const transformedValue = this.transformValueToHumanReadable(rawValue);
                        categoryValues.push(transformedValue);
                    }
                });
            });
        }

        return Array.from(new Set(categoryValues)).sort();
    }
}
