
import { BUILD_CONFIG } from "../../build-config";
import { CategorizedProcessor, CategorizedProcessorOptions } from "../lib/CategorizedProcessor";

export class MethodsProcessor extends CategorizedProcessor {
    private static defaultCategoryKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

    constructor() {
        super({
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
        } as CategorizedProcessorOptions);
    }
}
