import { MethodConversionHandler } from "@mat3ra/mode";

import { MethodStandata } from "./method";
import MODEL_METHOD_DATA from "./runtime_data/applications/modelMethodMapByApplication.json";
import {
    ApplicationMethodParametersInterface,
    ModelMethodMapByApplication,
} from "./types/applicationFilter";
import { ApplicationFilterStandata, FilterMode } from "./utils/applicationFilter";

export class ApplicationMethodStandata extends ApplicationFilterStandata {
    constructor() {
        const data = MODEL_METHOD_DATA as ModelMethodMapByApplication;
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

    getDefaultMethodConfigForApplication(applicationConfig: any): any {
        const { name, version, build, executable, flavor } = applicationConfig;

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
        const simpleMethod = MethodConversionHandler.convertToSimple(categorizedMethod);
        return simpleMethod;
    }
}
