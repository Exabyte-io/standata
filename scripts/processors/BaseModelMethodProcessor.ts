// eslint-disable-next-line import/no-extraneous-dependencies
import { CategorizedEntityProcessor } from "./CategorizedEntityProcessor";
import { EntityProcessorOptions } from "./EntityProcessor";

export interface ModelMethodProcessorOptions extends EntityProcessorOptions {
    categoryCollectOptions?: {
        includeUnits?: boolean;
        includeTags?: boolean;
        includeEntitiesMap?: boolean;
    };
}

export abstract class BaseModelMethodProcessor extends CategorizedEntityProcessor {
    protected readonly options: ModelMethodProcessorOptions;

    constructor(options: ModelMethodProcessorOptions) {
        super(options);
        this.options = options;
    }

    public getCategoryCollectOptions() {
        return {
            includeUnits: false,
            includeTags: false,
            includeEntitiesMap: false,
            ...this.options.categoryCollectOptions,
        };
    }

    public addCategoriesFromObject(
        obj: any,
        categoryKeys: string[],
        includeTags: boolean,
        categorySets: Record<string, Set<string>>,
    ): void {
        if (obj?.categories) {
            categoryKeys.forEach((key) => {
                const v = obj.categories[key];
                if (typeof v === "string" && v) (categorySets as any)[key].add(v);
            });
        }
        if (includeTags && Array.isArray(obj?.tags)) {
            obj.tags.forEach((t: string) => (categorySets as any).tags.add(t));
        }
    }

    public addCategoriesToSet(
        obj: any,
        categoryKeys: string[],
        includeTags: boolean,
        target: Set<string>,
    ): void {
        if (obj?.categories) {
            categoryKeys.forEach((key) => {
                const v = obj.categories[key];
                if (typeof v === "string" && v) target.add(v);
            });
        }
        if (includeTags && Array.isArray(obj?.tags)) obj.tags.forEach((t: string) => target.add(t));
    }

    protected getDataSubdirectory(entity: any): string {
        const fullPathAsURL = entity.path || "";
        const finalPath = fullPathAsURL.split("?")[0];
        return finalPath;
    }
}
