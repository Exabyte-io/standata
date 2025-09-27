import type { MethodConfig, MethodUnit } from "./types/method";
import type { ModelConfig } from "./types/model";
// TODO: Create proper model-method compatibility mapping
const MODEL_METHOD_MAP = {};

export interface FilterRule {
    path?: string;
    regex?: string;
}

export interface ModelMethodFilterMap {
    [tier1: string]:
        | {
              [tier2: string]:
                  | {
                        [tier3: string]:
                            | {
                                  [type: string]:
                                      | {
                                            [subtype: string]: FilterRule[];
                                        }
                                      | FilterRule[];
                              }
                            | FilterRule[];
                    }
                  | FilterRule[];
          }
        | FilterRule[];
}

export class ModelMethodFilter {
    private filterMap: ModelMethodFilterMap;

    constructor() {
        this.filterMap = MODEL_METHOD_MAP as ModelMethodFilterMap;
    }

    getCompatibleMethods(model: ModelConfig, allMethods: MethodConfig[]): MethodConfig[] {
        const filterRules = this.getFilterRulesForModel(model);
        if (!filterRules) {
            return [];
        }

        return allMethods.filter((method) => this.isMethodCompatible(method, filterRules));
    }

    private getFilterRulesForModel(model: ModelConfig): FilterRule[] | null {
        const { tier1, tier2, tier3, type, subtype } = model.categories;

        // Return null if any required category is missing
        if (!tier1 || !tier2 || !tier3 || !type || !subtype) {
            return null;
        }

        try {
            let current: any = this.filterMap;

            // Navigate through the nested structure
            current = current[tier1];
            if (!current) return null;

            if (Array.isArray(current)) return current;
            current = current[tier2];
            if (!current) return null;

            if (Array.isArray(current)) return current;
            current = current[tier3];
            if (!current) return null;

            if (Array.isArray(current)) return current;
            current = current[type];
            if (!current) return null;

            if (Array.isArray(current)) return current;
            current = current[subtype];
            if (!current) return null;

            return Array.isArray(current) ? current : null;
        } catch (error) {
            console.warn(`Failed to get filter rules for model ${model.name}:`, error);
            return null;
        }
    }

    private isMethodCompatible(method: MethodConfig, filterRules: FilterRule[]): boolean {
        // Check if any unit in the method matches any filter rule
        return method.units.some((unit: MethodUnit) =>
            filterRules.some((rule) => this.isUnitMatchingRule(unit, rule)),
        );
    }

    private isUnitMatchingRule(unit: MethodUnit, rule: FilterRule): boolean {
        if (rule.path) {
            return unit.path === rule.path;
        }

        if (rule.regex) {
            try {
                const regex = new RegExp(rule.regex);
                return regex.test(unit.path);
            } catch (error) {
                console.warn(`Invalid regex pattern: ${rule.regex}`, error);
                return false;
            }
        }

        return false;
    }

    getFilterMap(): ModelMethodFilterMap {
        return this.filterMap;
    }

    getAllFilterRules(): FilterRule[] {
        const rules: FilterRule[] = [];

        const extractRules = (obj: any) => {
            if (Array.isArray(obj)) {
                rules.push(...obj);
            } else if (typeof obj === "object" && obj !== null) {
                Object.values(obj).forEach(extractRules);
            }
        };

        extractRules(this.filterMap);
        return rules;
    }

    getUniqueFilterPaths(): string[] {
        const rules = this.getAllFilterRules();
        const paths = new Set(
            rules.map((rule) => rule.path).filter((path): path is string => path !== undefined),
        );
        return Array.from(paths);
    }

    getUniqueFilterRegexes(): string[] {
        const rules = this.getAllFilterRules();
        const regexes = new Set(
            rules.map((rule) => rule.regex).filter((regex): regex is string => regex !== undefined),
        );
        return Array.from(regexes);
    }
}
