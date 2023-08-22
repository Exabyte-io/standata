interface EntityItem {
    filename: string;
    categories: string[];
}

interface EntityCategories {
    [key: string]: string[];
}

export interface StandataConfig {
    categories: EntityCategories;
    entities: EntityItem[];
}

export class Standata {
    entities: EntityItem[];

    categories: string[];

    protected categoryMap: EntityCategories;

    protected lookupTable: {
        [key: string]: Set<string>;
    };

    constructor({ categories, entities }: StandataConfig) {
        this.categoryMap = categories || {};
        this.entities = entities || [];
        this.categories = this.flattenCategories();
        this.lookupTable = this.createLookupTable();
    }

    flattenCategories(separator = "/"): string[] {
        const categories = Object.entries(this.categoryMap)
            .flatMap(([type, tags]) => tags.map((t) => `${type}${separator}${t}`))
            .sort((a, b) => a.localeCompare(b));
        return [...new Set(categories)];
    }

    convertTagToCategory(...tags: string[]): string[] {
        return this.categories.filter((c) => tags.some((t) => c.split("/")[1] === t));
    }

    protected createLookupTable(): { [key: string]: Set<string> } {
        const lookupTable: { [key: string]: Set<string> } = {};
        // eslint-disable-next-line no-restricted-syntax
        for (const entity of this.entities) {
            const categories_ = this.convertTagToCategory(...entity.categories);
            const { filename } = entity;
            // eslint-disable-next-line no-restricted-syntax
            for (const category of categories_) {
                lookupTable[category] = lookupTable[category]?.add(filename) || new Set([filename]);
            }
        }
        return lookupTable;
    }

    // eslint-disable-next-line class-methods-use-this
    protected loadEntity(filename: string): object | undefined {
        console.warn(`loadEntity(${filename}) must be implemented in derived class!`);
        return { filename };
    }

    protected filterByCategories(...categories: string[]): string[] {
        if (!categories.length) {
            return [];
        }
        const filenames = this.entities.map((e) => e.filename);
        // eslint-disable-next-line no-restricted-syntax
        for (const category of categories) {
            filenames.filter((f) => this.lookupTable[category]?.has(f));
        }
        return filenames;
    }

    find_entities(...tags: string[]): object[] {
        const categories_ = this.convertTagToCategory(...tags);
        const filenames = this.filterByCategories(...categories_) || [];
        return filenames.map((f) => this.loadEntity(f)).filter(Boolean);
    }
}
