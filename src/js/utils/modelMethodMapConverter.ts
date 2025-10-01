import { ModelMethodFilterEntry, FilterRule } from "../modelMethodFilter";

/**
 * Utility to convert Mode.js nested model-method map to our flat structure
 */

interface ModeJsNestedMap {
    [tier1: string]: {
        [tier2: string]: {
            [tier3: string]: {
                [type: string]: FilterRule[] | {
                    [subtype: string]: FilterRule[]
                }
            }
        }
    }
}

/**
 * Convert Mode.js nested structure to flat ModelMethodFilterEntry array
 */
export function convertNestedMapToFlat(nestedMap: ModeJsNestedMap): ModelMethodFilterEntry[] {
    const flatEntries: ModelMethodFilterEntry[] = [];

    for (const [tier1, tier2Map] of Object.entries(nestedMap)) {
        for (const [tier2, tier3Map] of Object.entries(tier2Map)) {
            for (const [tier3, typeMap] of Object.entries(tier3Map)) {
                for (const [type, value] of Object.entries(typeMap)) {

                    // If value is directly an array of FilterRules
                    if (Array.isArray(value)) {
                        flatEntries.push({
                            modelCategories: { tier1, tier2, tier3, type },
                            filterRules: value
                        });
                    }
                    // If value is an object with subtypes
                    else if (typeof value === 'object') {
                        for (const [subtype, filterRules] of Object.entries(value)) {
                            if (Array.isArray(filterRules)) {
                                flatEntries.push({
                                    modelCategories: { tier1, tier2, tier3, type, subtype },
                                    filterRules: filterRules
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    return flatEntries;
}

/**
 * Example usage with Mode.js data:
 *
 * const modeJsMap = {
 *   "pb": {
 *     "qm": {
 *       "dft": {
 *         "ksdft": {
 *           "lda": [{ "path": "/qm/wf/none/pw/none" }],
 *           "gga": [{ "path": "/qm/wf/none/pw/none" }]
 *         }
 *       }
 *     }
 *   }
 * };
 *
 * const flatMap = convertNestedMapToFlat(modeJsMap);
 */
