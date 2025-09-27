"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelMethodFilter = void 0;
// TODO: Create proper model-method compatibility mapping
const MODEL_METHOD_MAP = {};
class ModelMethodFilter {
    constructor() {
        this.filterMap = MODEL_METHOD_MAP;
    }
    getCompatibleMethods(model, allMethods) {
        const filterRules = this.getFilterRulesForModel(model);
        if (!filterRules) {
            return [];
        }
        return allMethods.filter((method) => this.isMethodCompatible(method, filterRules));
    }
    getFilterRulesForModel(model) {
        const { tier1, tier2, tier3, type, subtype } = model.categories;
        // Return null if any required category is missing
        if (!tier1 || !tier2 || !tier3 || !type || !subtype) {
            return null;
        }
        try {
            let current = this.filterMap;
            // Navigate through the nested structure
            current = current[tier1];
            if (!current)
                return null;
            if (Array.isArray(current))
                return current;
            current = current[tier2];
            if (!current)
                return null;
            if (Array.isArray(current))
                return current;
            current = current[tier3];
            if (!current)
                return null;
            if (Array.isArray(current))
                return current;
            current = current[type];
            if (!current)
                return null;
            if (Array.isArray(current))
                return current;
            current = current[subtype];
            if (!current)
                return null;
            return Array.isArray(current) ? current : null;
        }
        catch (error) {
            console.warn(`Failed to get filter rules for model ${model.name}:`, error);
            return null;
        }
    }
    isMethodCompatible(method, filterRules) {
        // Check if any unit in the method matches any filter rule
        return method.units.some((unit) => filterRules.some((rule) => this.isUnitMatchingRule(unit, rule)));
    }
    isUnitMatchingRule(unit, rule) {
        if (rule.path) {
            return unit.path === rule.path;
        }
        if (rule.regex) {
            try {
                const regex = new RegExp(rule.regex);
                return regex.test(unit.path);
            }
            catch (error) {
                console.warn(`Invalid regex pattern: ${rule.regex}`, error);
                return false;
            }
        }
        return false;
    }
    getFilterMap() {
        return this.filterMap;
    }
    getAllFilterRules() {
        const rules = [];
        const extractRules = (obj) => {
            if (Array.isArray(obj)) {
                rules.push(...obj);
            }
            else if (typeof obj === "object" && obj !== null) {
                Object.values(obj).forEach(extractRules);
            }
        };
        extractRules(this.filterMap);
        return rules;
    }
    getUniqueFilterPaths() {
        const rules = this.getAllFilterRules();
        const paths = new Set(rules.map((rule) => rule.path).filter((path) => path !== undefined));
        return Array.from(paths);
    }
    getUniqueFilterRegexes() {
        const rules = this.getAllFilterRules();
        const regexes = new Set(rules.map((rule) => rule.regex).filter((regex) => regex !== undefined));
        return Array.from(regexes);
    }
}
exports.ModelMethodFilter = ModelMethodFilter;
