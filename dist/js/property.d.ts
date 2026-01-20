import { Standata } from "./base";
export declare class PropertyStandata extends Standata {
    static runtimeData: {
        filesMapByName: {};
        standataConfig: {
            categories: {
                application: string[];
                measurement: string[];
                property_class: string[];
                type: string[];
                value_type: string[];
            };
            entities: {
                categories: string[];
                filename: string;
            }[];
        };
    };
}
