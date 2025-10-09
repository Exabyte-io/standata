import BUILD_CONFIG from "../../build-config";
import { BaseEntityDataBuilder } from "../BaseEntityDataBuilder";
import { processAndSaveEntity } from "../utils";

const categoriesKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

class ModelDataBuilder extends BaseEntityDataBuilder {
    protected getSubdirectory(entity: any, _sourceFile: string): string {
        const fullPathAsURL = entity.path;
        const finalPath = fullPathAsURL.split("?")[0];
        return finalPath;
    }

    protected processEntity(entity: any, sourceFile: string): void {
        processAndSaveEntity(
            entity,
            sourceFile,
            this.dataPath,
            categoriesKeys,
            (entityItem, sourceFileItem) => this.getSubdirectory(entityItem, sourceFileItem),
        );
    }
}

const builder = new ModelDataBuilder({
    assetsPath: BUILD_CONFIG.models.assets.path,
    dataPath: BUILD_CONFIG.models.data.path,
    categoriesFile: BUILD_CONFIG.models.assets.categories,
});

builder.build();
