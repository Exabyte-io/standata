import { Standata } from "./base";
import { MethodConfig, MethodUnit } from "./types/method";
export declare class MethodStandata extends Standata<MethodConfig> {
    static runtimeData: {
        standataConfig: {
            categories: {
                tier1: string[];
                tier2: string[];
                tier3: string[];
                type: string[];
                subtype: string[];
                tags: string[];
            };
            entities: never[];
        };
        filesMapByName: {};
    };
    getAllMethods(): MethodConfig[];
    getMethodByName(name: string): MethodConfig | undefined;
    getMethodsByUnitType(unitType: string): MethodConfig[];
    getMethodsByUnitSubtype(unitSubtype: string): MethodConfig[];
    getMethodsByUnitTags(...tags: string[]): MethodConfig[];
    getMethodsByPath(path: string): MethodConfig[];
    getMethodsByUnitParameters(parameters: Record<string, any>): MethodConfig[];
    getAllMethodNames(): string[];
    getAllMethodPaths(): string[];
    getAllUnits(): MethodUnit[];
    getUniqueUnitTypes(): string[];
    getUniqueUnitSubtypes(): string[];
    getMethodsCompatibleWithModel(modelPath: string, filterMap: Record<string, any>): MethodConfig[];
}
