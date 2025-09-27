import { Standata } from "./base";
import MODELS from "./runtime_data/models.json";
import { ModelConfig } from "./types/model";

export class ModelStandata extends Standata<ModelConfig> {
    static runtimeData = MODELS;

    getAllModels(): ModelConfig[] {
        return this.getAll();
    }

    getModelByName(name: string): ModelConfig | undefined {
        const allModels = this.getAllModels();
        return allModels.find((model) => model.name === name);
    }

    getModelsByCategory(category: string): ModelConfig[] {
        const allModels = this.getAllModels();
        return allModels.filter((model) => {
            const categoryPath = `${model.categories.tier1 || "none"}/${
                model.categories.tier2 || "none"
            }/${model.categories.tier3 || "none"}/${model.categories.type || "none"}/${
                model.categories.subtype || "none"
            }`;
            return categoryPath.includes(category);
        });
    }

    getModelsBySubtype(subtype: string): ModelConfig[] {
        const allModels = this.getAllModels();
        return allModels.filter((model) => model.categories.subtype === subtype);
    }

    getModelsByTags(...tags: string[]): ModelConfig[] {
        const allModels = this.getAllModels();
        return allModels.filter(
            (model) => model.tags && tags.some((tag) => model.tags!.includes(tag)),
        );
    }

    getModelsByPath(path: string): ModelConfig[] {
        const allModels = this.getAllModels();
        return allModels.filter((model) => model.path === path);
    }

    getModelsByParameters(parameters: Record<string, any>): ModelConfig[] {
        const allModels = this.getAllModels();
        return allModels.filter((model) => {
            if (!model.parameters) return false;
            return Object.entries(parameters).every(
                ([key, value]) => model.parameters![key] === value,
            );
        });
    }

    getAllModelNames(): string[] {
        const allModels = this.getAllModels();
        return allModels.map((model) => model.name);
    }

    getAllModelPaths(): string[] {
        const allModels = this.getAllModels();
        return allModels.map((model) => model.path);
    }

    getUniqueSubtypes(): string[] {
        const allModels = this.getAllModels();
        const subtypes = new Set(
            allModels
                .map((model) => model.categories.subtype)
                .filter((subtype): subtype is string => subtype !== undefined),
        );
        return Array.from(subtypes);
    }
}
