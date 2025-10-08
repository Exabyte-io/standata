import BUILD_CONFIG from "../../build-config";
import { MethodModelCategorizer } from "../MethodModelCategorizer";

const categorizer = new MethodModelCategorizer({
    categoriesPath: `${BUILD_CONFIG.models.assets.path}/${BUILD_CONFIG.models.assets.categories}`,
    dataPath: BUILD_CONFIG.models.data.path,
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
