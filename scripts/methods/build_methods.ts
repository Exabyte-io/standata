import * as path from "path";

import BUILD_CONFIG from "../../build-config";
import { BaseEntityDataBuilder } from "../BaseEntityDataBuilder";
import { encodeDataAsURLPath, processAndSaveEntity } from "../utils";

const categoriesKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

class MethodDataBuilder extends BaseEntityDataBuilder {
    protected getSubdirectory(_entity: any, sourceFile: string): string {
        const basename = path.basename(sourceFile, path.extname(sourceFile));
        return basename.replace(/_methods?$/i, "");
    }

    protected processEntity(entity: any, sourceFile: string): void {
        if (entity.units) {
            entity.units.forEach((unit: any) => {
                unit.path = encodeDataAsURLPath(unit, categoriesKeys);
                delete unit.schema;
            });
            entity.path = entity.units.map((unit: any) => unit.path).join("::");
        }

        processAndSaveEntity(
            entity,
            sourceFile,
            this.dataPath,
            categoriesKeys,
            (entityItem, sourceFileItem) => this.getSubdirectory(entityItem, sourceFileItem),
        );
    }
}

const builder = new MethodDataBuilder({
    assetsPath: BUILD_CONFIG.methods.assets.path,
    dataPath: BUILD_CONFIG.methods.data.path,
    categoriesFile: BUILD_CONFIG.methods.assets.categories,
});

builder.build();
