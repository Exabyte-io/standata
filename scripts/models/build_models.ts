import BUILD_CONFIG from "../../build-config";
import { ModelMethodEntityBuilder } from "../ModelMethodEntityBuilder";

const builder = new ModelMethodEntityBuilder({
    sourcesPath: BUILD_CONFIG.models.assets.path,
    dataPath: BUILD_CONFIG.models.data.path,
    entityType: "models",
    pathSeparator: "/",
    categoryKeys: ["tier1", "tier2", "tier3", "type", "subtype"],
    pathPlaceholder: "none",
    hasUnits: false,
    subdirectoryResolver: ({ entity }) => entity.categories?.subtype || "unknown",
});

builder.build();
