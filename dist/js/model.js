"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelStandata = void 0;
const base_1 = require("./base");
const models_json_1 = __importDefault(require("./runtime_data/models.json"));
class ModelStandata extends base_1.Standata {
    getAllModels() {
        return this.getAll();
    }
    getModelByName(name) {
        const allModels = this.getAllModels();
        return allModels.find((model) => model.name === name);
    }
    getModelsByCategory(category) {
        const allModels = this.getAllModels();
        return allModels.filter((model) => {
            const categoryPath = `${model.categories.tier1 || "none"}/${model.categories.tier2 || "none"}/${model.categories.tier3 || "none"}/${model.categories.type || "none"}/${model.categories.subtype || "none"}`;
            return categoryPath.includes(category);
        });
    }
    getModelsBySubtype(subtype) {
        const allModels = this.getAllModels();
        return allModels.filter((model) => model.categories.subtype === subtype);
    }
    getModelsByTags(...tags) {
        const allModels = this.getAllModels();
        return allModels.filter((model) => model.tags && tags.some((tag) => model.tags.includes(tag)));
    }
    getModelsByPath(path) {
        const allModels = this.getAllModels();
        return allModels.filter((model) => model.path === path);
    }
    getModelsByParameters(parameters) {
        const allModels = this.getAllModels();
        return allModels.filter((model) => {
            if (!model.parameters)
                return false;
            return Object.entries(parameters).every(([key, value]) => model.parameters[key] === value);
        });
    }
    getAllModelNames() {
        const allModels = this.getAllModels();
        return allModels.map((model) => model.name);
    }
    getAllModelPaths() {
        const allModels = this.getAllModels();
        return allModels.map((model) => model.path);
    }
    getUniqueSubtypes() {
        const allModels = this.getAllModels();
        const subtypes = new Set(allModels
            .map((model) => model.categories.subtype)
            .filter((subtype) => subtype !== undefined));
        return Array.from(subtypes);
    }
}
exports.ModelStandata = ModelStandata;
ModelStandata.runtimeData = models_json_1.default;
