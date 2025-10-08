import BUILD_CONFIG from "../../build-config";
import { MethodModelCategorizer } from "../MethodModelCategorizer";

const categorizer = new MethodModelCategorizer({
    categoriesPath: `${BUILD_CONFIG.methods.assets.path}/${BUILD_CONFIG.methods.assets.categories}`,
    dataPath: BUILD_CONFIG.methods.data.path,
    categoryPaths: [
        "categories.tier1",
        "categories.tier2",
        "categories.tier3",
        "categories.type",
        "categories.subtype",
        "tags",
    ],
});

categorizer.build();
