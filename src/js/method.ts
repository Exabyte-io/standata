import { Standata } from "./base";
import METHODS from "./runtime_data/methods.json";
import { MethodConfig, UnitMethod } from "./types/method";

function getCategoryValue(category: string | { name: string; slug: string } | undefined): string | undefined {
    if (!category) return undefined;
    return typeof category === "string" ? category : category.slug;
}

export class MethodStandata extends Standata<MethodConfig> {
    static runtimeData = METHODS;

    getMethodByName(name: string): MethodConfig | undefined {
        const allMethods = this.getAll();
        return allMethods.find((method) => method.name === name);
    }

    getMethodsByUnitType(unitType: string): MethodConfig[] {
        const allMethods = this.getAll();
        return allMethods.filter((method) =>
            method.units.some((unit) => getCategoryValue(unit.categories.type) === unitType),
        );
    }

    getMethodsByUnitSubtype(unitSubtype: string): MethodConfig[] {
        const allMethods = this.getAll();
        return allMethods.filter((method) =>
            method.units.some((unit) => getCategoryValue(unit.categories.subtype) === unitSubtype),
        );
    }

    getMethodsByUnitTags(...tags: string[]): MethodConfig[] {
        const allMethods = this.getAll();
        return allMethods.filter((method) =>
            method.units.some((unit) => tags.some((tag) => unit.tags.includes(tag))),
        );
    }

    getMethodsByPath(path: string): MethodConfig[] {
        const allMethods = this.getAll();
        return allMethods.filter((method) => method.path === path);
    }

    getMethodsByUnitParameters(parameters: Record<string, any>): MethodConfig[] {
        const allMethods = this.getAll();
        return allMethods.filter((method) =>
            method.units.some((unit) => {
                if (!unit.parameters) return false;
                return Object.entries(parameters).every(
                    ([key, value]) => unit.parameters[key] === value,
                );
            }),
        );
    }

    getAllMethodNames(): string[] {
        const allMethods = this.getAll();
        return allMethods.map((method) => method.name);
    }

    getAllMethodPaths(): string[] {
        const allMethods = this.getAll();
        return allMethods.map((method) => method.path);
    }

    getAllUnits(): UnitMethod[] {
        const allMethods = this.getAll();
        return allMethods.flatMap((method) => method.units);
    }

    getUniqueUnitTypes(): string[] {
        const allUnits = this.getAllUnits();
        const types = new Set(
            allUnits
                .map((unit) => getCategoryValue(unit.categories.type))
                .filter((type): type is string => type !== undefined),
        );
        return Array.from(types);
    }

    getUniqueUnitSubtypes(): string[] {
        const allUnits = this.getAllUnits();
        const subtypes = new Set(
            allUnits
                .map((unit) => getCategoryValue(unit.categories.subtype))
                .filter((subtype): subtype is string => subtype !== undefined),
        );
        return Array.from(subtypes);
    }

    getMethodsCompatibleWithModel(
        modelPath: string,
        filterMap: Record<string, any>,
    ): MethodConfig[] {
        // This would use the model-method filter map to find compatible methods
        // Implementation depends on the filter map structure
        const allMethods = this.getAll();
        // TODO: Implement filtering logic based on model-method compatibility map
        // For now, return all methods (placeholder implementation)
        console.log(`Finding methods compatible with model path: ${modelPath}`, filterMap);
        return allMethods;
    }
}
