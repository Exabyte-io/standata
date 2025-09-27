import { FilterTree } from "../types/applicationFilter";
export declare abstract class ApplicationFilterStandata {
    protected filterTree: FilterTree;
    constructor(filterTree: FilterTree);
    protected filterByApplicationParameters(entityList: any[], name: string, version?: string, build?: string, executable?: string, flavor?: string): any[];
    getAvailableEntities(name: string): any;
}
