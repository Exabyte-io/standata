import { ApplicationFilterStandata } from "./utils/applicationFilter";
export interface ApplicationModelParametersInterface {
    modelList: any[];
    applicationName: string;
    version?: string;
    build?: string;
    executable?: string;
    flavor?: string;
}
export declare class ApplicationModelStandata extends ApplicationFilterStandata {
    constructor();
    findByApplicationParameters({ modelList, applicationName, version, build, executable, flavor, }: ApplicationModelParametersInterface): any[];
    getAvailableModels(applicationName: string): any;
}
