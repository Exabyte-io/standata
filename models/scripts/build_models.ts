import { BuildConfig, buildEntities } from "../../methods/scripts/buildUtils";
import BUILD_CONFIG from "../../build-config";

const buildConfig: BuildConfig = {
    sourcesPath: BUILD_CONFIG.models.sources.path,
    dataPath: BUILD_CONFIG.models.data.path,
    entityType: "models",
};

buildEntities(buildConfig);
