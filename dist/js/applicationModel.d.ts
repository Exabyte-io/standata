import { ApplicationFilterStandata } from "./utils/applicationFilter";
import { ApplicationModelParametersInterface } from "./types/applicationFilter";
export declare class ApplicationModelStandata extends ApplicationFilterStandata {
    constructor();
    findByApplicationParameters({ modelList, name, version, build, executable, flavor, }: ApplicationModelParametersInterface): any[];
    getAvailableModels(name: string): any;
}
