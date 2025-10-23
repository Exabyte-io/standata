import { ApplicationMethodParametersInterface } from "./types/applicationFilter";
import { ApplicationFilterStandata } from "./utils/applicationFilter";
export declare class ApplicationMethodStandata extends ApplicationFilterStandata {
    constructor();
    findByApplicationParameters({ methodList, name, version, build, executable, flavor, }: ApplicationMethodParametersInterface): any[];
    getAvailableMethods(name: string): any;
    getDefaultMethodConfigForApplication(applicationConfig: any): any;
}
