import { BUILD_CONFIG } from "../../build-config";
import { encodeDataAsURLPath } from "../utils";
import { BaseModelMethodProcessor } from "./BaseModelMethodProcessor";

export class MethodsProcessor extends BaseModelMethodProcessor {
    private static defaultCategoryKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

    constructor(rootDir: string) {
        super({
            rootDir,
            entityNamePlural: "methods",
            assetsDir: BUILD_CONFIG.methods.assets.path,
            dataDir: BUILD_CONFIG.methods.data.path,
            buildDir: BUILD_CONFIG.methods.build?.path,
            categoriesRelativePath: BUILD_CONFIG.methods.assets.categories,
            categoryKeys: MethodsProcessor.defaultCategoryKeys,
            categoryCollectOptions: {
                includeUnits: true,
                includeTags: true,
                includeEntitiesMap: true,
            },
        });
    }

    protected transformEntity(entity: any): any {
        if (entity?.units) {
            const categoryKeys = this.options.categoryKeys || [];
            entity.units.forEach((unit: any) => {
                unit.path = encodeDataAsURLPath(unit, categoryKeys);
                delete unit.schema;
            });
            entity.path = entity.units.map((u: any) => u.path).join("::");
        }
        return entity;
    }

    protected getDataSubdirectory(_entity: any): string {
        return super.getDataSubdirectory(_entity).split("::")[0];
    }
}
