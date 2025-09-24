import { ApplicationFilterStandata } from "./application";
import MODEL_METHOD_DATA from "./runtime_data/modelMethodMapByApplication.json";

export interface ApplicationModelParametersInterface {
    modelList: any[];
    applicationName: string;
    version?: string;
    build?: string;
    executable?: string;
    flavor?: string;
}

export class ApplicationModelStandata extends ApplicationFilterStandata {
    constructor() {
        const data = MODEL_METHOD_DATA as any;
        super(data?.models);
    }

    findByApplicationParameters({
        modelList,
        applicationName,
        version,
        build,
        executable,
        flavor,
    }: ApplicationModelParametersInterface): any[] {
        return this.filterByApplicationParameters(
            modelList,
            applicationName,
            version,
            build,
            executable,
            flavor,
        );
    }

    getAvailableModels(applicationName: string): any {
        return this.getAvailableEntities(applicationName);
    }
}
