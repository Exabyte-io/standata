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
    get name(): string;
    get nonVersionProperties(): {
        name: string;
        shortName: string;
        summary: string;
        isLicensed?: boolean | undefined;
    };
    get versionConfigs(): ApplicationVersionInfo[];
    get versionConfigsFull(): ApplicationSchemaBase[];
    getSlugForVersionConfig(versionConfigFull: ApplicationSchemaBase): string;
}
