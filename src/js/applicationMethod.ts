import { ApplicationFilterStandata } from "./application";

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
        super("methods");
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
