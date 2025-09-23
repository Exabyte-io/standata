import { ApplicationFilterStandata } from "./application";

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
        super("models");
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
