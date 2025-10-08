import * as lodash from "lodash";

import { BaseEntityBuilder, BuilderConfig } from "./BaseEntityBuilder";

interface SubdirectoryContext {
    entity: any;
    sourceFile: string;
}

type SubdirectoryResolver = (context: SubdirectoryContext) => string;

interface EntityBuilderConfig extends BuilderConfig {
    pathSeparator: string;
    categoryKeys: string[];
    pathPlaceholder: string;
    subdirectoryResolver: SubdirectoryResolver;
    hasUnits: boolean;
}

/**
 * Specialized builder for methods and models that encodes categories as URL paths.
 *
 * Features:
 * - Encodes entity categories into URL-style paths from configurable category keys
 * - Handles query parameters for entity parameters
 * - Optional units processing (joins paths with separator)
 * - Configurable subdirectory resolution
 * - Removes schema fields before saving
 *
 * Example output path:
 *   /dft/lda/pz/pseudopotential/norm_conserving?functional=pz
 */
export class ModelMethodEntityBuilder extends BaseEntityBuilder {
    private pathSeparator: string;

    private categoryKeys: string[];

    private pathPlaceholder: string;

    private subdirectoryResolver: SubdirectoryResolver;

    private hasUnits: boolean;

    constructor(config: EntityBuilderConfig) {
        super(config);
        this.pathSeparator = config.pathSeparator;
        this.categoryKeys = config.categoryKeys;
        this.pathPlaceholder = config.pathPlaceholder;
        this.hasUnits = config.hasUnits;
        this.subdirectoryResolver = config.subdirectoryResolver;
    }

    protected getSubdirectory(entity: any, sourceFile: string): string {
        return this.subdirectoryResolver({ entity, sourceFile });
    }

    protected encodeAsURLPath(data: any): string {
        const pathParts = this.categoryKeys
            .map((key) => lodash.get(data.categories, key, this.pathPlaceholder))
            .join("/");

        const params = new URLSearchParams();
        if (data.parameters) {
            Object.keys(data.parameters).forEach((key) => {
                const value = data.parameters[key];
                params.append(key, lodash.isObject(value) ? JSON.stringify(value) : value);
            });
        }

        return params.toString() ? `/${pathParts}?${params.toString()}` : `/${pathParts}`;
    }

    protected setEntityPath(entity: any): void {
        if (this.hasUnits && entity.units) {
            entity.units.forEach((unit: any) => {
                unit.path = this.encodeAsURLPath(unit);
                delete unit.schema;
            });
            entity.path = entity.units.map((u: any) => u.path).join(this.pathSeparator);
        } else {
            entity.path = this.encodeAsURLPath(entity);
        }
        delete entity.schema;
    }

    protected processEntity(entity: any, sourceFile: string): void {
        if (!entity.name) return;

        this.setEntityPath(entity);
        const subdirectory = this.getSubdirectory(entity, sourceFile);
        this.saveEntity(entity, subdirectory);
    }
}
