import * as path from "path";

import BUILD_CONFIG from "../../build-config";
import { buildEntities, encodeDataAsURLPath, processAndSaveEntity } from "../utils";

const categoriesKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

function getSubdirectory(_entity: any, sourceFile: string): string {
    const basename = path.basename(sourceFile, path.extname(sourceFile));
    return basename.replace(/_methods?$/i, "");
}

function processEntity(entity: any, sourceFile: string): void {
    if (entity.units) {
        entity.units.forEach((unit: any) => {
            unit.path = encodeDataAsURLPath(unit, categoriesKeys);
            delete unit.schema;
        });
        entity.path = entity.units.map((u: any) => u.path).join("::");
    }

    processAndSaveEntity(
        entity,
        sourceFile,
        BUILD_CONFIG.methods.data.path,
        categoriesKeys,
        getSubdirectory,
    );
}

buildEntities({
    sourcesPath: BUILD_CONFIG.methods.assets.path,
    dataPath: BUILD_CONFIG.methods.data.path,
    processEntity,
    getSubdirectory,
    categoriesFile: BUILD_CONFIG.methods.assets.categories,
});
