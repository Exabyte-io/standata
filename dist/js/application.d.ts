import { Standata } from "./base";
export declare class ApplicationStandata extends Standata {
    static runtimeData: {
        standataConfig: {
            categories: {
                model: string[];
                language_type: string[];
                purpose: string[];
            };
            entities: {
                filename: string;
                categories: string[];
            }[];
        };
        filesMapByName: {
            "espresso.json": {
                name: string;
                shortName: string;
                summary: string;
                hasAdvancedComputeOptions: boolean;
                isLicensed: boolean;
            };
            "espresso_gnu_540.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                build: string;
                hasAdvancedComputeOptions: boolean;
                isLicensed: boolean;
            };
            "python_386.json": {
                name: string;
                shortName: string;
                summary: string;
                version: string;
                build: string;
                hasAdvancedComputeOptions: boolean;
                isLicensed: boolean;
            };
        };
    };
}
