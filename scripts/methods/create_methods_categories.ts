import BUILD_CONFIG from "../../build-config";
import { generateCategoriesFile } from "../categoriesUtils";
import { METHOD_MODEL_VALUE_MAP } from "../valueMaps";

generateCategoriesFile({
    categoriesYamlFilePath: `${BUILD_CONFIG.methods.assets.path}/${BUILD_CONFIG.methods.assets.categories}`,
    dataPath: BUILD_CONFIG.methods.data.path,
    categoryPathsInEntity: [
        "categories.tier1",
        "categories.tier2",
        "categories.tier3",
        "categories.type",
        "categories.subtype",
        "tags",
    ],
    shortToHumanReadableValueMap: METHOD_MODEL_VALUE_MAP,
});
