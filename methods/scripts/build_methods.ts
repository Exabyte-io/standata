import { BuildConfig, buildEntities } from "./buildUtils";

const buildConfig: BuildConfig = {
    sourcesPath: "methods/sources",
    dataPath: "methods/data",
    entityType: "methods",
    pathSeparator: "::",
};

buildEntities(buildConfig);
