export declare abstract class ApplicationFilterStandata {
    protected filterTree: any;
    constructor(filterTree: any);
    protected filterByApplicationParameters(entityList: any[], applicationName: string, version?: string, build?: string, executable?: string, flavor?: string): any[];
    getAvailableEntities(applicationName: string): any;
}
