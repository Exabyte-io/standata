import path from "path";

import BUILD_CONFIG from "../../build-config";
import { ModelMethodEntityBuilder } from "../ModelMethodEntityBuilder";

const builder = new ModelMethodEntityBuilder({
    sourcesPath: BUILD_CONFIG.methods.assets.path,
    dataPath: BUILD_CONFIG.methods.data.path,
    entityType: "methods",
    pathSeparator: "::",
    categoryKeys: ["tier1", "tier2", "tier3", "type", "subtype"],
    pathPlaceholder: "none",
    hasUnits: true,
    subdirectoryResolver: ({ sourceFile }) => {
        const basename = path.basename(sourceFile, path.extname(sourceFile));
        return basename.replace(/_methods?$/i, "");
    },
});

builder.build();
