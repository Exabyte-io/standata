import BUILD_CONFIG from "../../build-config";
import { EntityBuilder } from "../EntityBuilder";

const builder = new EntityBuilder({
    sourcesPath: BUILD_CONFIG.models.assets.path,
    dataPath: BUILD_CONFIG.models.data.path,
    entityType: "models",
});

builder.build();
