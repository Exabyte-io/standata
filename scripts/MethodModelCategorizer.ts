import { BaseCategorizer, CategorizerConfig } from "./BaseCategorizer";

const SHORT_TO_HUMAN_READABLE: Record<string, string> = {
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
    private static VALUE_MAP: Record<string, string> = SHORT_TO_HUMAN_READABLE;

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
