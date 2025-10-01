import { ApplicationSchemaBase } from "@mat3ra/esse/dist/js/types";
import { ApplicationVersionInfo, ApplicationVersionsMapType } from "../types/application";
export declare class ApplicationVersionsMap implements ApplicationVersionsMapType {
    shortName?: string | undefined;
    summary?: string | undefined;
    isLicensed?: boolean | undefined;
    defaultVersion: string;
    versions: ApplicationVersionInfo[];
    map: ApplicationVersionsMapType;
    constructor(config: ApplicationVersionsMapType);
    get name(): string;
    get nonVersionProperties(): {
        shortName?: string | undefined;
        summary?: string | undefined;
        isLicensed?: boolean | undefined;
        name: string;
    };
    get versionConfigs(): ApplicationVersionInfo[];
    get versionConfigsFull(): ApplicationSchemaBase[];
    getSlugForVersionConfig(versionConfigFull: ApplicationSchemaBase): string;
}
