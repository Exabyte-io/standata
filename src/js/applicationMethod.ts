import { ApplicationFilterStandata } from "./utils/applicationFilter";
import MODEL_METHOD_DATA from "./runtime_data/modelMethodMapByApplication.json";

export interface ApplicationMethodParametersInterface {
    methodList: any[];
    applicationName: string;
    version?: string;
    build?: string;
    executable?: string;
    flavor?: string;
}

export class ApplicationMethodStandata extends ApplicationFilterStandata {
    constructor() {
        const data = MODEL_METHOD_DATA as any;
        super(data?.methods);
    }

    findByApplicationParameters({
        methodList,
        applicationName,
        version,
        build,
        executable,
        flavor,
    }: ApplicationMethodParametersInterface): any[] {
        return this.filterByApplicationParameters(
            methodList,
            applicationName,
            version,
            build,
            executable,
            flavor,
        );
    }

    getAvailableMethods(applicationName: string): any {
        return this.getAvailableEntities(applicationName);
    }
}
