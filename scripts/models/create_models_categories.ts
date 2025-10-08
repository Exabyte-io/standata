import BUILD_CONFIG from "../../build-config";
import { generateCategoriesFile, METHOD_MODEL_VALUE_MAP } from "../categoriesUtils";

generateCategoriesFile({
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
    valueMap: METHOD_MODEL_VALUE_MAP,
});
