import { ApplicationMethodParametersInterface } from "./types/applicationFilter";
import { ApplicationFilterStandata } from "./utils/applicationFilter";
export type SimpleMethod = {
    type: string;
    subtype: string;
};
export type MethodToSimple = (categorized: any) => SimpleMethod;
export declare class ApplicationMethodStandata extends ApplicationFilterStandata {
    private readonly convertToSimple?;
    constructor(convertToSimple?: MethodToSimple | undefined);
    findByApplicationParameters({ methodList, name, version, build, executable, flavor, }: ApplicationMethodParametersInterface): any[];
    getAvailableMethods(name: string): any;
    getDefaultMethodConfigForApplication(applicationConfig: any): SimpleMethod | any;
}
