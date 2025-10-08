import BUILD_CONFIG from "../../build-config";
import { EntityBuilder } from "../EntityBuilder";

const builder = new EntityBuilder({
    sourcesPath: BUILD_CONFIG.methods.assets.path,
    dataPath: BUILD_CONFIG.methods.data.path,
    entityType: "methods",
    pathSeparator: "::",
});

builder.build();
