import type { MethodConfig } from "./types/method";
import type { ModelConfig } from "./types/model";
export interface FilterRule {
    path?: string;
    regex?: string;
}
export interface ModelMethodFilterMap {
    [tier1: string]: {
        [tier2: string]: {
            [tier3: string]: {
                [type: string]: {
                    [subtype: string]: FilterRule[];
                } | FilterRule[];
            } | FilterRule[];
        } | FilterRule[];
    } | FilterRule[];
}
export declare class ModelMethodFilter {
    private filterMap;
    constructor();
    getCompatibleMethods(model: ModelConfig, allMethods: MethodConfig[]): MethodConfig[];
    private getFilterRulesForModel;
    private isMethodCompatible;
    private isUnitMatchingRule;
    getFilterMap(): ModelMethodFilterMap;
    getAllFilterRules(): FilterRule[];
    getUniqueFilterPaths(): string[];
    getUniqueFilterRegexes(): string[];
}
