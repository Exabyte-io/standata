// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

import BUILD_CONFIG from "../../build-config";
import { resolveFromRoot } from "../utils";
import { EntityProcessor, EntityProcessorOptions } from "./EntityProcessor";

export interface ModelMethodProcessorOptions extends EntityProcessorOptions {
    categoryCollectOptions?: {
        includeUnits?: boolean;
        includeTags?: boolean;
        includeEntitiesMap?: boolean;
    };
}

export abstract class BaseModelMethodProcessor extends EntityProcessor {
    protected readonly options: ModelMethodProcessorOptions;

    constructor(options: ModelMethodProcessorOptions) {
        super(options);
        this.options = options;
    }

    protected getCategoryCollectOptions() {
        return {
            includeUnits: false,
            includeTags: false,
            includeEntitiesMap: false,
            ...this.options.categoryCollectOptions,
        };
    }

    public updateCategoriesFile(): void {
        const dataPath = path.resolve(this.resolved.dataDir);
        const categoriesPath = this.options.categoriesRelativePath
            ? path.resolve(
                  resolveFromRoot(this.options.rootDir, this.options.assetsDir),
                  this.options.categoriesRelativePath,
              )
            : path.resolve(this.resolved.dataDir, "categories.yml");

        const categoryKeys = this.options.categoryKeys || [];
        const { includeUnits, includeTags, includeEntitiesMap } = this.getCategoryCollectOptions();

        const categorySets: Record<string, Set<string>> = Object.fromEntries(
            [...categoryKeys, includeTags ? "tags" : null]
                .filter(Boolean)
                .map((k) => [k as string, new Set<string>()]),
        ) as any;
        const entities: { filename: string; categories: string[] }[] = [];

        const jsonFiles = this.findJsonFilesRecursively(dataPath);
        for (const filePath of jsonFiles) {
            try {
                const data = serverUtils.json.readJSONFileSync(filePath) as any;
                this.addCategoriesFromObject(data, categoryKeys, includeTags, categorySets);
                if (includeUnits && Array.isArray((data as any)?.units)) {
                    for (const u of (data as any).units) {
                        this.addCategoriesFromObject(u, categoryKeys, includeTags, categorySets);
                    }
                }

                if (includeEntitiesMap) {
                    const relativePath = path.relative(this.resolved.dataDir, filePath);
                    const flat = new Set<string>();
                    this.addCategoriesToSet(data, categoryKeys, includeTags, flat);
                    if (includeUnits && Array.isArray((data as any)?.units)) {
                        for (const u of (data as any).units)
                            this.addCategoriesToSet(u, categoryKeys, includeTags, flat);
                    }
                    entities.push({ filename: relativePath, categories: Array.from(flat).sort() });
                }
            } catch (e: any) {
                console.error(`Error processing ${filePath}: ${e.message}`);
            }
        }

        const categoriesOut: any = {};
        categoryKeys.forEach((key) => {
            const arr = Array.from((categorySets as any)[key]).sort();
            if (arr.length > 0) categoriesOut[key] = arr;
        });
        if (includeTags) {
            const tagsArr = Array.from((categorySets as any).tags || []).sort();
            if (tagsArr.length > 0) categoriesOut.tags = tagsArr;
        }

        const payload = includeEntitiesMap
            ? {
                  categories: categoriesOut,
                  entities: entities.sort((a, b) => a.filename.localeCompare(b.filename)),
              }
            : { categories: categoriesOut, entities: [] };

        const yamlContent = yaml.dump(payload, {
            indent: BUILD_CONFIG.yamlFormat.indent,
            lineWidth: BUILD_CONFIG.yamlFormat.lineWidth,
            sortKeys: BUILD_CONFIG.yamlFormat.sortKeys as boolean,
        });
        serverUtils.file.createDirIfNotExistsSync(path.dirname(categoriesPath));
        fs.writeFileSync(categoriesPath, yamlContent, "utf-8");
        console.log(`Categories file written to: ${categoriesPath}`);
    }

    protected addCategoriesFromObject(
        obj: any,
        categoryKeys: string[],
        includeTags: boolean,
        categorySets: Record<string, Set<string>>,
    ): void {
        if (obj?.categories) {
            categoryKeys.forEach((key) => {
                const value = obj.categories[key];
                if (typeof value === "string" && value) (categorySets as any)[key].add(value);
            });
        }
        if (includeTags && Array.isArray(obj?.tags)) {
            obj.tags.forEach((t: string) => (categorySets as any).tags.add(t));
        }
    }

    protected addCategoriesToSet(
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
