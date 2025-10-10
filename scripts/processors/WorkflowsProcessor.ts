
import { BUILD_CONFIG } from "../../build-config";
import { CategorizedProcessor, CategorizedProcessorOptions } from "../lib/CategorizedProcessor";

export class WorkflowsProcessor extends CategorizedProcessor {
    private static defaultCategoryKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

    constructor() {
        super({
            entityNamePlural: "workflows",
            assetsDir: BUILD_CONFIG.workflows.assets.path,
            dataDir: BUILD_CONFIG.workflows.data.path + "/workflows",
            buildDir: BUILD_CONFIG.workflows.build?.path,
            categoriesRelativePath: BUILD_CONFIG.workflows.assets.workflowsCategories,
            categoryKeys: WorkflowsProcessor.defaultCategoryKeys,
            categoryCollectOptions: {
                includeUnits: false,
                includeTags: true,
                includeEntitiesMap: true,
            },
        } as CategorizedProcessorOptions);
    }
}
