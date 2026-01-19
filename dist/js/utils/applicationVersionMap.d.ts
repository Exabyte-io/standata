import { ApplicationSchemaBase } from "@mat3ra/esse/dist/js/types";
import { ApplicationVersionInfo, ApplicationVersionsMapType } from "../types/application";
export declare class ApplicationVersionsMap implements ApplicationVersionsMapType {
    shortName: string;
    summary: string;
    isLicensed?: boolean | undefined;
    defaultVersion: string;
    versions: ApplicationVersionInfo[];
    map: ApplicationVersionsMapType;
    constructor(config: ApplicationVersionsMapType);
    get name(): ApplicationSchemaBase;
    get nonVersionProperties(): {
        name: ApplicationSchemaBase;
        shortName: ApplicationSchemaBase;
        summary: ApplicationSchemaBase;
        isLicensed: ApplicationSchemaBase;
    };
    get versionConfigs(): ApplicationVersionInfo[];
    get versionConfigsFull(): ApplicationSchemaBase[];
    getSlugForVersionConfig(versionConfigFull: ApplicationSchemaBase): string;
}
