interface EntityItem {
    filename: string;
    categories: string[];
}
interface EntityCategories {
    [key: string]: string[];
}
export interface StandataConfig {
    categories: EntityCategories;
    entities: EntityItem[];
}
interface RuntimeData {
    standataConfig: StandataConfig;
    filesMapByName: object;
}
export declare class Standata {
    static runtimeData: RuntimeData;
    static getRuntimeDataConfigs(): [string, any][];
    entities: EntityItem[];
    categories: string[];
    protected categoryMap: EntityCategories;
    protected lookupTable: {
        [key: string]: Set<string>;
    };
    constructor(config?: StandataConfig);
    flattenCategories(separator?: string): string[];
    convertTagToCategory(...tags: string[]): string[];
    protected createLookupTable(): {
        [key: string]: Set<string>;
    };
    protected loadEntity(filename: string): object | undefined;
    protected filterByCategories(...categories: string[]): string[];
    findEntitiesByTags(...tags: string[]): object[];
}
export {};
