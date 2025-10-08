import BUILD_CONFIG from "../../build-config";
import { generateCategoriesFile, METHOD_MODEL_VALUE_MAP } from "../categoriesUtils";

generateCategoriesFile({
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
    valueMap: METHOD_MODEL_VALUE_MAP,
});
