import BUILD_CONFIG from "../../build-config";
import { BuildConfig, buildEntities } from "./buildUtils";

const buildConfig: BuildConfig = {
    sourcesPath: BUILD_CONFIG.methods.assets.path,
    dataPath: BUILD_CONFIG.methods.data.path,
    entityType: "methods",
    pathSeparator: "::",
};

buildEntities(buildConfig);
