import { ApplicationFilterStandata } from "./utils/applicationFilter";
export interface ApplicationMethodParametersInterface {
    methodList: any[];
    applicationName: string;
    version?: string;
    build?: string;
    executable?: string;
    flavor?: string;
}
export declare class ApplicationMethodStandata extends ApplicationFilterStandata {
    constructor();
    findByApplicationParameters({ methodList, applicationName, version, build, executable, flavor, }: ApplicationMethodParametersInterface): any[];
    getAvailableMethods(applicationName: string): any;
}
