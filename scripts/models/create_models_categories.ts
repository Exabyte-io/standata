import BUILD_CONFIG from "../../build-config";
import { generateCategoriesFile } from "../categoriesUtils";

generateCategoriesFile({
    categoriesYamlFilePath: `${BUILD_CONFIG.models.assets.path}/${BUILD_CONFIG.models.assets.categories}`,
    dataPath: BUILD_CONFIG.models.data.path,
    categoryPathsInEntity: [
        "categories.tier1",
        "categories.tier2",
        "categories.tier3",
        "categories.type",
        "categories.subtype",
        "tags",
    ],
});
