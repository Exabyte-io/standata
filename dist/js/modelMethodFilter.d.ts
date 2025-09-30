import type { MethodConfig } from "./types/method";
import type { ModelConfig } from "./types/model";
export interface FilterRule {
    path?: string;
    regex?: string;
}
export interface ModelCategories {
    tier1?: string;
    tier2?: string;
    tier3?: string;
    type?: string;
    subtype?: string;
}
export interface ModelMethodFilterEntry {
    modelCategories: ModelCategories;
    filterRules: FilterRule[];
}
export type ModelMethodFilterMap = ModelMethodFilterEntry[];
export declare class ModelMethodFilter {
    private filterMap;
    constructor();
    getCompatibleMethods(model: ModelConfig, allMethods: MethodConfig[]): MethodConfig[];
    private getFilterRulesForModel;
    private categoriesMatch;
    private isMethodCompatible;
    private isUnitMatchingRule;
    getFilterMap(): ModelMethodFilterMap;
    getAllFilterRules(): FilterRule[];
    getUniqueFilterPaths(): string[];
    getUniqueFilterRegexes(): string[];
}
