import { FilterRule, ModelMethodFilterEntry } from "../types/modelMethodFilter";
/**
 * Utility to convert Mode.js nested model-method map to our flat structure
 */
interface ModeJsNestedMap {
    [tier1: string]: {
        [tier2: string]: {
            [tier3: string]: {
                [type: string]: FilterRule[] | {
                    [subtype: string]: FilterRule[];
                };
            };
        };
    };
}
/**
 * Convert Mode.js nested structure to flat ModelMethodFilterEntry array
 */
export declare function convertNestedMapToFlat(nestedMap: ModeJsNestedMap): ModelMethodFilterEntry[];
export {};
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
