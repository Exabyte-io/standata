
import { BUILD_CONFIG } from "../../build-config";
import { CategorizedProcessor, CategorizedProcessorOptions } from "../lib/CategorizedProcessor";

export class ApplicationsProcessor extends CategorizedProcessor {
    private static defaultCategoryKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

    constructor() {
        super({
            entityNamePlural: "applications",
            assetsDir: BUILD_CONFIG.applications.assets.path,
            dataDir: BUILD_CONFIG.applications.data.path,
            buildDir: BUILD_CONFIG.applications.build?.path,
            categoriesRelativePath: BUILD_CONFIG.applications.assets.categories,
            categoryKeys: ApplicationsProcessor.defaultCategoryKeys,
            categoryCollectOptions: {
                includeUnits: false,
                includeTags: true,
                includeEntitiesMap: true,
            },
        } as CategorizedProcessorOptions);
    }
}
