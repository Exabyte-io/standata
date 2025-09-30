// eslint-disable-next-line import/no-extraneous-dependencies
import { ApplicationSchemaBase } from "@mat3ra/esse/dist/js/types";

import { ApplicationVersionInfo, ApplicationVersionsMapType } from "../types/application";

export class ApplicationVersionsMap implements ApplicationVersionsMapType {
    shortName?: string | undefined;

    summary?: string | undefined;

    isLicensed?: boolean | undefined;

    defaultVersion: string;

    versions: ApplicationVersionInfo[];

    map: ApplicationVersionsMapType;

    constructor(config: ApplicationVersionsMapType) {
        this.map = config;
        this.defaultVersion = config.defaultVersion;
        this.versions = config.versions;
        this.shortName = config.shortName;
        this.summary = config.summary;
        this.isLicensed = config.isLicensed;
    }

    get name() {
        return this.map.name;
    }

    get nonVersionProperties() {
        const { versions, defaultVersion, ...rest } = this.map;
        return rest;
    }

    get versionConfigs() {
        return this.map.versions;
    }

    get versionConfigsFull(): ApplicationSchemaBase[] {
        return this.versionConfigs.map((versionConfig) => {
            return {
                ...this.nonVersionProperties,
                ...versionConfig,
            };
        });
    }

    getSlugForVersionConfig(versionConfigFull: ApplicationSchemaBase) {
        const buildSuffix = versionConfigFull.build
            ? `_${versionConfigFull.build.toLowerCase()}`
            : "";
        const versionSuffix = versionConfigFull.version;
        return `${this.name}${buildSuffix}_${versionSuffix}.json`;
    }
}
