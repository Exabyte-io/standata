import { ApplicationFilterStandata } from "./utils/applicationFilter";
import MODEL_METHOD_DATA from "./runtime_data/modelMethodMapByApplication.json";
import { ApplicationMethodParametersInterface } from "./types/applicationFilter";

export class ApplicationMethodStandata extends ApplicationFilterStandata {
    constructor() {
        const data = MODEL_METHOD_DATA as any;
        super(data?.methods);
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
