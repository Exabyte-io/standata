import { Standata } from "./base";
export declare class PropertyStandata extends Standata {
    static runtimeData: {
        standataConfig: {
            categories: {
                type: string[];
                property_class: string[];
                value_type: string[];
                measurement: string[];
                application: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "valence_band_offset.json": {
                name: string;
                units: string;
                value: number;
            };
            "band_structure.json": {
                name: string;
                spin: number[];
                xAxis: {
                    label: string;
                    units: string;
                };
                xDataArray: number[][];
                yAxis: {
                    label: string;
                    units: string;
                };
                yDataSeries: number[][];
            };
        };
    };
}
export declare const properties: PropertyStandata;
