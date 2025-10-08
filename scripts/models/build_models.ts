import BUILD_CONFIG from "../../build-config";
import { buildEntities, encodeDataAsURLPath, saveEntity } from "../buildUtils";

const categoriesKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

function getSubdirectory(entity: any, _sourceFile: string): string {
    if (!entity.categories) {
        throw new Error(`Entity "${entity.name}" is missing categories`);
    }

    for (const key of [...categoriesKeys].reverse()) {
        if (entity.categories[key]) {
            return entity.categories[key];
        }
    }

    throw new Error(
        `Entity "${entity.name}" has no valid category from: ${categoriesKeys.join(", ")}`,
    );
}

function processEntity(entity: any, sourceFile: string): void {
    if (!entity.name) return;

    entity.path = encodeDataAsURLPath(entity, categoriesKeys);
    delete entity.schema;

    const subdirectory = getSubdirectory(entity, sourceFile);
    saveEntity(entity, subdirectory, BUILD_CONFIG.models.data.path);
}

buildEntities({
    sourcesPath: BUILD_CONFIG.models.assets.path,
    dataPath: BUILD_CONFIG.models.data.path,
    processEntity,
    getSubdirectory,
    categoriesFile: BUILD_CONFIG.models.assets.categories,
});
