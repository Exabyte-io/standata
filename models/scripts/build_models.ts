import { BuildConfig, buildEntities } from "../../methods/scripts/buildUtils";

const buildConfig: BuildConfig = {
    sourcesPath: "models/sources",
    dataPath: "models/data",
    entityType: "models",
};

buildEntities(buildConfig);
