"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MethodStandata = void 0;
const base_1 = require("./base");
const methods_json_1 = __importDefault(require("./runtime_data/methods.json"));
function getCategoryValue(category) {
    if (!category)
        return undefined;
    return typeof category === "string" ? category : category.slug;
}
class MethodStandata extends base_1.Standata {
    getMethodByName(name) {
        const allMethods = this.getAll();
        return allMethods.find((method) => method.name === name);
    }
    getMethodsByUnitType(unitType) {
        const allMethods = this.getAll();
        return allMethods.filter((method) => method.units.some((unit) => getCategoryValue(unit.categories.type) === unitType));
    }
    getMethodsByUnitSubtype(unitSubtype) {
        const allMethods = this.getAll();
        return allMethods.filter((method) => method.units.some((unit) => getCategoryValue(unit.categories.subtype) === unitSubtype));
    }
    getMethodsByUnitTags(...tags) {
        const allMethods = this.getAll();
        return allMethods.filter((method) => method.units.some((unit) => tags.some((tag) => unit.tags.includes(tag))));
    }
    getMethodsByPath(path) {
        const allMethods = this.getAll();
        return allMethods.filter((method) => method.path === path);
    }
    getMethodsByUnitParameters(parameters) {
        const allMethods = this.getAll();
        return allMethods.filter((method) => method.units.some((unit) => {
            if (!unit.parameters)
                return false;
            return Object.entries(parameters).every(([key, value]) => unit.parameters[key] === value);
        }));
    }
    getAllMethodNames() {
        const allMethods = this.getAll();
        return allMethods.map((method) => method.name);
    }
    getAllMethodPaths() {
        const allMethods = this.getAll();
        return allMethods.map((method) => method.path);
    }
    getAllUnits() {
        const allMethods = this.getAll();
        return allMethods.flatMap((method) => method.units);
    }
    getUniqueUnitTypes() {
        const allUnits = this.getAllUnits();
        const types = new Set(allUnits
            .map((unit) => getCategoryValue(unit.categories.type))
            .filter((type) => type !== undefined));
        return Array.from(types);
    }
    getUniqueUnitSubtypes() {
        const allUnits = this.getAllUnits();
        const subtypes = new Set(allUnits
            .map((unit) => getCategoryValue(unit.categories.subtype))
            .filter((subtype) => subtype !== undefined));
        return Array.from(subtypes);
    }
    getMethodsCompatibleWithModel(modelPath, filterMap) {
        // This would use the model-method filter map to find compatible methods
        // Implementation depends on the filter map structure
        const allMethods = this.getAll();
        // TODO: Implement filtering logic based on model-method compatibility map
        // For now, return all methods (placeholder implementation)
        console.log(`Finding methods compatible with model path: ${modelPath}`, filterMap);
        return allMethods;
    }
}
exports.MethodStandata = MethodStandata;
MethodStandata.runtimeData = methods_json_1.default;
