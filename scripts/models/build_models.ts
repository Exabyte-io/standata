import BUILD_CONFIG from "../../build-config";
import { buildEntities, processAndSaveEntity } from "../utils";

const categoriesKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

function getSubdirectory(entity: any, _sourceFile: string): string {
    const fullPathAsURL = entity.path;
    const finalPath = fullPathAsURL.split("?")[0]; // Remove query parameters if any
    return finalPath;
}

function processEntity(entity: any, sourceFile: string): void {
    processAndSaveEntity(
        entity,
        sourceFile,
        BUILD_CONFIG.models.data.path,
        categoriesKeys,
        getSubdirectory,
    );
}

buildEntities({
    sourcesPath: BUILD_CONFIG.models.assets.path,
    dataPath: BUILD_CONFIG.models.data.path,
    processEntity,
    getSubdirectory,
    categoriesFile: BUILD_CONFIG.models.assets.categories,
});
