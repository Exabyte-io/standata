import * as yaml from "js-yaml";

import { StandataYamlSchema } from "../utils";

export interface CategoryData {
    key: string;
    values: Set<string>;
    isManual: boolean;
}

export class CategoryManager {
    private categories: Map<string, CategoryData>;

    constructor() {
        this.categories = new Map();
    }

    public initializeCategory(key: string, isManual: boolean = false): void {
        if (!this.categories.has(key)) {
            this.categories.set(key, {
                key,
                values: new Set(),
                isManual,
            });
        }
    }

    public addValue(categoryKey: string, value: string): void {
        const category = this.categories.get(categoryKey);
        if (category && !category.isManual) {
            category.values.add(value);
        }
    }

    public setManualValues(categoryKey: string, values: string[]): void {
        const category = this.categories.get(categoryKey);
        if (category && category.isManual) {
            category.values = new Set(values);
        }
    }

    public getCategoryValues(categoryKey: string): string[] {
        const category = this.categories.get(categoryKey);
        return category ? Array.from(category.values).sort() : [];
    }

    public isManual(categoryKey: string): boolean {
        const category = this.categories.get(categoryKey);
        return category ? category.isManual : false;
    }

    public getAllCategoryKeys(): string[] {
        return Array.from(this.categories.keys());
    }

    public loadExistingCategories(categoriesPath: string): void {
        try {
            const fs = require("fs");
            if (!fs.existsSync(categoriesPath)) {
                return;
            }

            const content = yaml.load(fs.readFileSync(categoriesPath, "utf-8"), {
                schema: StandataYamlSchema,
            }) as any;

            if (!content?.categories) {
                return;
            }

            Object.entries(content.categories).forEach(([key, value]) => {
                if (this.categories.has(key)) {
                    const isManual = this.isManualMarker(value);
                    const values = this.extractValues(value);

                    if (isManual && this.categories.get(key)?.isManual) {
                        this.setManualValues(key, values);
                    }
                }
            });
        } catch (error) {
            console.warn(`Warning: Could not load existing categories from ${categoriesPath}`);
        }
    }

    private isManualMarker(value: any): boolean {
        return value && typeof value === "object" && value.__manually_added === true;
    }

    private extractValues(value: any): string[] {
        if (this.isManualMarker(value)) {
            return Array.isArray(value.values) ? value.values : [];
        }
        return Array.isArray(value) ? value : [];
    }

    public toCategoriesObject(): Record<string, any> {
        const result: Record<string, any> = {};

        this.getAllCategoryKeys().forEach((key) => {
            const category = this.categories.get(key);
            if (!category) return;

            const sortedValues = this.getCategoryValues(key);
            if (sortedValues.length === 0) return;

            if (category.isManual) {
                result[key] = {
                    __manually_added: true,
                    values: sortedValues,
                };
            } else {
                result[key] = sortedValues;
            }
        });

        return result;
    }

    public dumpYAML(indent: number = 2, lineWidth: number = -1, sortKeys: boolean = false): string {
        return yaml.dump(this.toCategoriesObject(), {
            schema: StandataYamlSchema,
            indent,
            lineWidth,
            sortKeys,
        });
    }
}

