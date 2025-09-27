import { Standata } from "./base";
import METHODS from "./runtime_data/methods.json";
import { MethodConfig, MethodUnit } from "./types/method";

export class MethodStandata extends Standata<MethodConfig> {
    static runtimeData = METHODS;

    getAllMethods(): MethodConfig[] {
        return this.getAll();
    }

    getMethodByName(name: string): MethodConfig | undefined {
        const allMethods = this.getAllMethods();
        return allMethods.find((method) => method.name === name);
    }

    getMethodsByUnitType(unitType: string): MethodConfig[] {
        const allMethods = this.getAllMethods();
        return allMethods.filter((method) =>
            method.units.some((unit) => unit.categories.type === unitType),
        );
    }

    getMethodsByUnitSubtype(unitSubtype: string): MethodConfig[] {
        const allMethods = this.getAllMethods();
        return allMethods.filter((method) =>
            method.units.some((unit) => unit.categories.subtype === unitSubtype),
        );
    }

    getMethodsByUnitTags(...tags: string[]): MethodConfig[] {
        const allMethods = this.getAllMethods();
        return allMethods.filter((method) =>
            method.units.some((unit) => tags.some((tag) => unit.tags.includes(tag))),
        );
    }

    getMethodsByPath(path: string): MethodConfig[] {
        const allMethods = this.getAllMethods();
        return allMethods.filter((method) => method.path === path);
    }

    getMethodsByUnitParameters(parameters: Record<string, any>): MethodConfig[] {
        const allMethods = this.getAllMethods();
        return allMethods.filter((method) =>
            method.units.some((unit) => {
                if (!unit.parameters) return false;
                return Object.entries(parameters).every(
                    ([key, value]) => unit.parameters![key] === value,
                );
            }),
        );
    }

    getAllMethodNames(): string[] {
        const allMethods = this.getAllMethods();
        return allMethods.map((method) => method.name);
    }

    getAllMethodPaths(): string[] {
        const allMethods = this.getAllMethods();
        return allMethods.map((method) => method.path);
    }

    getAllUnits(): MethodUnit[] {
        const allMethods = this.getAllMethods();
        return allMethods.flatMap((method) => method.units);
    }

    getUniqueUnitTypes(): string[] {
        const allUnits = this.getAllUnits();
        const types = new Set(allUnits.map((unit) => unit.categories.type));
        return Array.from(types);
    }

    getUniqueUnitSubtypes(): string[] {
        const allUnits = this.getAllUnits();
        const subtypes = new Set(
            allUnits
                .map((unit) => unit.categories.subtype)
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
        const allMethods = this.getAllMethods();
        // TODO: Implement filtering logic based on model-method compatibility map
        // For now, return all methods (placeholder implementation)
        console.log(`Finding methods compatible with model path: ${modelPath}`, filterMap);
        return allMethods;
    }
}
