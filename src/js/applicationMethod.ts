import { ApplicationFilterStandata } from "./utils/applicationFilter";
import MODEL_METHOD_DATA from "./runtime_data/modelMethodMapByApplication.json";
import { ApplicationMethodParametersInterface, ModelMethodMapByApplication } from "./types/applicationFilter";

export class ApplicationMethodStandata extends ApplicationFilterStandata {
    constructor() {
        const data = MODEL_METHOD_DATA as ModelMethodMapByApplication;
        super(data?.methods as any); // Cast to any for FilterTree compatibility
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
}
