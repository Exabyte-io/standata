import { MethodStandata } from "./method";
import MODEL_METHOD_DATA from "./runtime_data/applications/modelMethodMapByApplication.json";
import { ApplicationMethodParametersInterface } from "./types/applicationFilter";
import { ApplicationFilterStandata, FilterMode } from "./utils/applicationFilter";

// A converter function that turns a categorized method into the "simple" shape.
// Mode can inject its own implementation at runtime via the constructor.
export type SimpleMethod = { type: string; subtype: string };
export type MethodToSimple = (categorized: any) => SimpleMethod;

export class ApplicationMethodStandata extends ApplicationFilterStandata {
    constructor(private readonly convertToSimple?: MethodToSimple) {
        const data = MODEL_METHOD_DATA;
        super(data?.methods as any, FilterMode.ALL_MATCH);
    }

    findByApplicationParameters({
        methodList,
        name,
        version,
        build,
        executable,
        flavor,
    }: ApplicationMethodParametersInterface): any[] {
        return this.filterByApplicationParameters(
            methodList,
            name,
            version,
            build,
            executable,
            flavor,
        );
    }

    getAvailableMethods(name: string): any {
        return this.getAvailableEntities(name);
    }

    getDefaultMethodConfigForApplication(applicationConfig: any): SimpleMethod | any {
        const { name, version, build, executable, flavor } = applicationConfig;

        const availableMethods = this.getAvailableMethods(name);
        if (!availableMethods || Object.keys(availableMethods).length === 0) {
            return { type: "unknown", subtype: "unknown" } satisfies SimpleMethod;
        }

        const methodStandata = new MethodStandata();
        const allMethods = methodStandata.getAll();

        const categorizedMethod = this.filterByApplicationParametersGetDefault(
            allMethods,
            name,
            version,
            build,
            executable,
            flavor,
        );

        if (!this.convertToSimple) {
            return categorizedMethod;
        }
        return this.convertToSimple(categorizedMethod);
    }
}
