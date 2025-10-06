import BUILD_CONFIG from "../../build-config";
import { BuildConfig, buildEntities } from "../methods/buildUtils";

const buildConfig: BuildConfig = {
    sourcesPath: BUILD_CONFIG.models.sources.path,
    dataPath: BUILD_CONFIG.models.data.path,
    entityType: "models",
};

buildEntities(buildConfig);
