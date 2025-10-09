// eslint-disable-next-line import/no-extraneous-dependencies
import { JsYamlAllSchemas } from "@mat3ra/code/dist/js/utils";
import { Utils } from "@mat3ra/utils";
// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import * as fs from "fs";
import * as lodash from "lodash";
import * as path from "path";

import BUILD_CONFIG from "../build-config";
// For applications
import { ApplicationVersionsMapType } from "../src/js/types/application";
import { ApplicationVersionsMap } from "../src/js/utils/applicationVersionMap";
// For workflows
// eslint-disable-next-line import/no-extraneous-dependencies
import {
    builders,
    createSubworkflowByName,
    createWorkflowConfigs,
    Subworkflow,
    UnitFactory,
    Workflow, // @ts-ignore
} from "@mat3ra/wode";
import * as yaml from "js-yaml";

export function readYAMLFileResolved(filePath: string): any {
    return serverUtils.yaml.readYAMLFile(filePath, { schema: JsYamlAllSchemas });
}

export function resolveFromRoot(scriptDirname: string, ...pathSegments: string[]): string {
    return path.resolve(scriptDirname, "../..", ...pathSegments);
}

/**
 * Converts YAML file to JSON, optionally resolving relative includes from a working directory
 */
export function buildJSONFromYAMLInDir({
    assetPath,
    targetPath,
    workingDir,
    spaces = 0,
}: {
    assetPath: string;
    targetPath: string;
    workingDir?: string;
    spaces?: number;
}): any {
    const originalCwd = process.cwd();
    try {
        if (workingDir) {
            process.chdir(workingDir);
        }

        const data = readYAMLFileResolved(assetPath);
        const resolvedTargetPath = workingDir ? path.resolve(originalCwd, targetPath) : targetPath;

        serverUtils.json.writeJSONFileSync(resolvedTargetPath, data, {
            spaces,
        });
        console.log(`Written asset "${assetPath}" to "${targetPath}"`);
        return data;
    } finally {
        if (workingDir) {
            process.chdir(originalCwd);
        }
    }
}

/**
 * Loads a directory tree of YAML files into a nested object structure.
 */
export function loadYAMLTree(
    rootPath: string,
    createObjectPath: (filePath: string, rootPath: string) => string,
): Record<string, any> {
    const tree: Record<string, any> = {};

    function traverse(currentPath: string) {
        if (!fs.existsSync(currentPath)) return;

        const stat = fs.statSync(currentPath);

        if (stat.isDirectory()) {
            const items = fs.readdirSync(currentPath);
            items.forEach((item) => traverse(path.join(currentPath, item)));
        } else if (stat.isFile() && /\.(yml|yaml)$/i.test(currentPath)) {
            try {
                const data = readYAMLFileResolved(currentPath);
                const objectPath = createObjectPath(currentPath, rootPath);
                lodash.set(tree, objectPath, data);
            } catch (error) {
                console.error(`Error loading ${currentPath}:`, error);
            }
        }
    }

    traverse(rootPath);
    return tree;
}

// Functions for processing entities from YAML files to JSON files when some processing inside the files is needed

export interface EntityProcessorConfig {
    sourcesPath: string;
    dataPath: string;
    processEntity: (entity: any, sourceFile: string) => void;
    getSubdirectory: (entity: any, sourceFile: string) => string;
    categoriesFile: string;
}

/**
 * Encodes entity data as a URL path with categories and parameters.
 */
export function encodeDataAsURLPath(
    data: any,
    categoryKeys: string[] = [],
    placeholder = "none",
): string {
    const pathSegments = categoryKeys.map((key) => data.categories?.[key] || placeholder).join("/");

    const params = new URLSearchParams();
    if (data.parameters) {
        Object.entries(data.parameters).forEach(([key, value]) => {
            const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
            params.append(key, stringValue);
        });
    }

    return params.toString() ? `/${pathSegments}?${params.toString()}` : `/${pathSegments}`;
}

/**
 * Builds entity JSON files from YAML sources when some processing is needed.
 */
export function buildEntities(config: EntityProcessorConfig): void {
    const { categoriesFile } = config;
    serverUtils.file.cleanDirectorySync(config.dataPath, [categoriesFile]);

    const yamlFiles = serverUtils.file.getFilesInDirectory(config.sourcesPath, [".yml", ".yaml"]);

    yamlFiles.forEach((filePath) => {
        try {
            const parsedFile = readYAMLFileResolved(filePath);
            const entities = Utils.array.normalizeToArray(parsedFile);
            entities.forEach((entity) => config.processEntity(entity, filePath));
        } catch (error: any) {
            console.error(`  Error: ${error.message}`);
        }
    });
}

/**
 * Processes and saves an entity with standard operations:
 * encodes path, deletes schema, determines subdirectory, and saves.
 */
export function processAndSaveEntity(
    entity: any,
    sourceFile: string,
    dataPath: string,
    categoryKeys: string[],
    getSubdirectory: (entity: any, sourceFile: string) => string,
    spaces = BUILD_CONFIG.jsonFormat.spaces,
): void {
    if (!entity.name) return;

    if (!entity.path) {
        entity.path = encodeDataAsURLPath(entity, categoryKeys);
    }
    delete entity.schema;

    const subdirectory = getSubdirectory(entity, sourceFile);
    const targetDir = path.join(dataPath, subdirectory);
    const filename = `${Utils.str.createSafeFilename(entity.name)}.json`;
    const targetPath = path.join(targetDir, filename);

    serverUtils.json.writeJSONFileSync(targetPath, entity, { spaces });
    console.log(`  Created: ${targetPath}`);
}

/**
 * Loads YAML files from a directory and stores them in a map keyed by filename (without extension).
 */
export function loadYAMLFilesAsMap(dirPath: string): Record<string, any> {
    const map: Record<string, any> = {};
    const yamlFiles = serverUtils.file.getFilesInDirectory(dirPath, [".yml", ".yaml"]);

    yamlFiles.forEach((filePath) => {
        const filename = path.basename(filePath);
        const key = filename.replace(/\.(yml|yaml)$/i, "");
        map[key] = readYAMLFileResolved(filePath);
    });

    return map;
}

// ============================================
// OOP processors API
// ============================================

export interface EntityProcessorOptions {
    /** Absolute or resolved root for this script (usually __dirname). */
    rootDir: string;
    /** Human-readable entity name, used for logs and runtime dir naming */
    entityName: string;
    /** Path to assets directory (relative to repo root). */
    assetsDir: string;
    /** Path to data directory (relative to repo root). */
    dataDir: string;
    /** Optional path to build directory (relative to repo root). */
    buildDir?: string;
    /** Optional path to dist runtime directory (relative to repo root). */
    distRuntimeDir?: string;
    /** Relative path to categories.yml inside assets, if applicable. */
    categoriesRelativePath?: string;
    /** Category keys to construct URL-like entity.path if not present. */
    categoryKeys?: string[];
}

export type AssetRecord = {
    /** Absolute path to the source YAML file */
    sourceFile: string;
    /** Parsed entity or list of entities */
    entities: any[];
};

export abstract class EntityProcessor {
    protected readonly options: EntityProcessorOptions;
    protected readonly resolved: {
        assetsDir: string;
        dataDir: string;
        buildDir?: string;
        distRuntimeDir?: string;
    };
    protected assets: AssetRecord[] = [];

    constructor(options: EntityProcessorOptions) {
        this.options = options;
        this.resolved = {
            assetsDir: resolveFromRoot(options.rootDir, options.assetsDir),
            dataDir: resolveFromRoot(options.rootDir, options.dataDir),
            buildDir: options.buildDir ? resolveFromRoot(options.rootDir, options.buildDir) : undefined,
            distRuntimeDir: options.distRuntimeDir
                ? resolveFromRoot(options.rootDir, options.distRuntimeDir)
                : resolveFromRoot(options.rootDir, BUILD_CONFIG.runtimeDataDir),
        };
    }

    /** Hook: allow subclasses to prepare state before any writes. */
    // eslint-disable-next-line class-methods-use-this
    protected onBeforeBuildDirectoryContent(): void {}

    /** Hook: mutate entity before writing to data directory. */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    protected transformEntity(entity: any, _sourceFile: string): any {
        return entity;
    }

    /** Hook: compute subdirectory for a given entity. Must be provided by subclasses when needed. */
    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    protected getDataSubdirectory(_entity: any, _sourceFile: string): string {
        return "";
    }

    /** Optional additional step at end of process. */
    // eslint-disable-next-line class-methods-use-this
    protected additionalProcessing(): void {}

    /** Loads YAML assets and normalizes to array of entities per file. */
    public readAssets(): AssetRecord[] {
        const yamlFiles = serverUtils.file.getFilesInDirectory(this.resolved.assetsDir, [".yml", ".yaml"]);
        this.assets = yamlFiles.map((filePath: string) => {
            const parsed = readYAMLFileResolved(filePath);
            const entities = Utils.array.normalizeToArray(parsed);
            return { sourceFile: filePath, entities } as AssetRecord;
        });
        return this.assets;
    }

    /** Writes aggregated artifacts into build directory, if configured. */
    public writeBuildDirectoryContent(): void {
        if (!this.resolved.buildDir) return;
        serverUtils.file.createDirIfNotExistsSync(this.resolved.buildDir);
        this.onBeforeBuildDirectoryContent();
        const artifacts = this.getBuildArtifacts();
        artifacts.forEach(({ relativePath, content }) => {
            const targetPath = path.resolve(this.resolved.buildDir as string, relativePath);
            serverUtils.file.createDirIfNotExistsSync(path.dirname(targetPath));
            serverUtils.json.writeJSONFileSync(targetPath, content, { spaces: BUILD_CONFIG.jsonFormat.spaces });
            console.log(`  Built: ${targetPath}`);
        });
    }

    /** Subclasses can override to emit build artifacts. */
    // eslint-disable-next-line class-methods-use-this
    protected getBuildArtifacts(): { relativePath: string; content: any }[] {
        return [];
    }

    /** Writes individual entity files into data directory. */
    public writeDataDirectoryContent(): void {
        const { dataDir } = this.resolved;
        serverUtils.file.createDirIfNotExistsSync(dataDir);

        const categoryKeys = this.options.categoryKeys || [];
        this.assets.forEach(({ sourceFile, entities }) => {
            entities.forEach((entity: any) => {
                const transformed = this.transformEntity({ ...entity }, sourceFile);
                // Set path if not present using categories
                if (!transformed.path && categoryKeys.length > 0) {
                    transformed.path = encodeDataAsURLPath(transformed, categoryKeys);
                }
                delete transformed.schema;

                const subdir = this.getDataSubdirectory(transformed, sourceFile);
                const targetDir = path.join(dataDir, subdir);
                const filename = `${Utils.str.createSafeFilename(transformed.name || "entity")}.json`;
                const targetPath = path.join(targetDir, filename);
                serverUtils.json.writeJSONFileSync(targetPath, transformed, {
                    spaces: BUILD_CONFIG.jsonFormat.spaces,
                });
                console.log(`  Created: ${targetPath}`);
            });
        });
    }

    /** Publishes build and data content to dist runtime directory. */
    public writeDistDirectoryContent(): void {
        const entityRuntimeDir = path.resolve(
            this.resolved.distRuntimeDir as string,
            Utils.str.createSafeFilename(this.options.entityName),
        );
        serverUtils.file.createDirIfNotExistsSync(entityRuntimeDir);

        // Copy data directory
        // Prefer a conservative copy: enumerate JSON files and write them out
        const copyJsonFiles = (fromDir: string | undefined) => {
            if (!fromDir || !fs.existsSync(fromDir)) return;
            const files = serverUtils.file.getFilesInDirectory(fromDir, [".json"]);
            files.forEach((filePath: string) => {
                // Preserve relative structure under fromDir
                const rel = path.relative(fromDir, filePath);
                const destPath = path.resolve(entityRuntimeDir, rel);
                serverUtils.file.createDirIfNotExistsSync(path.dirname(destPath));
                const content = serverUtils.json.readJSONFileSync(filePath);
                serverUtils.json.writeJSONFileSync(destPath, content, { spaces: 0 });
                console.log(`  Dist: ${destPath}`);
            });
        };

        copyJsonFiles(this.resolved.dataDir);
        copyJsonFiles(this.resolved.buildDir);
    }

    /** Updates categories.yml if subclass supports computing categories. */
    // eslint-disable-next-line class-methods-use-this
    public updateCategoriesFile(): void {
        // Default: no-op. Subclasses can implement logic to compute and write categories YAML
    }

    /** Orchestrates the processing pipeline. */
    public process(): void {
        console.log(`▶ Processing ${this.options.entityName} ...`);
        this.readAssets();
        this.writeBuildDirectoryContent();
        this.writeDataDirectoryContent();
        this.writeDistDirectoryContent();
        this.updateCategoriesFile();
        this.additionalProcessing();
        console.log(`✅ ${this.options.entityName} completed.`);
    }
}

// --------------------------------------------
// Concrete processors
// --------------------------------------------

export abstract class BaseModelMethodProcessor extends EntityProcessor {
    // Subclasses may override to enable tags/units scanning and entities list
    // eslint-disable-next-line class-methods-use-this
    protected getCategoryCollectOptions(): { includeUnits: boolean; includeTags: boolean; includeEntitiesMap: boolean } {
        return { includeUnits: false, includeTags: false, includeEntitiesMap: false };
    }

    public updateCategoriesFile(): void {
        const dataPath = path.resolve(this.resolved.dataDir);
        const categoriesPath = this.options.categoriesRelativePath
            ? path.resolve(resolveFromRoot(this.options.rootDir, this.options.assetsDir), this.options.categoriesRelativePath)
            : path.resolve(this.resolved.dataDir, "categories.yml");

        const categoryKeys = this.options.categoryKeys || [];
        const { includeUnits, includeTags, includeEntitiesMap } = this.getCategoryCollectOptions();

        const categorySets: Record<string, Set<string>> = Object.fromEntries(
            [...categoryKeys, includeTags ? "tags" : null].filter(Boolean).map((k) => [k as string, new Set<string>()]),
        ) as any;
        const entities: { filename: string; categories: string[] }[] = [];

        const findJsonFilesRecursively = (dir: string): string[] => {
            const results: string[] = [];
            const items = fs.readdirSync(dir);
            items.forEach((item) => {
                const full = path.join(dir, item);
                const stat = fs.statSync(full);
                if (stat.isDirectory()) results.push(...findJsonFilesRecursively(full));
                else if (stat.isFile() && item.endsWith(".json")) results.push(full);
            });
            return results;
        };

        const addCatsFromObj = (obj: any) => {
            if (obj?.categories) {
                categoryKeys.forEach((key) => {
                    const value = obj.categories[key];
                    if (typeof value === "string" && value) (categorySets as any)[key].add(value);
                });
            }
            if (includeTags && Array.isArray(obj?.tags)) {
                obj.tags.forEach((t: string) => (categorySets as any).tags.add(t));
            }
        };

        const jsonFiles = findJsonFilesRecursively(dataPath);
        jsonFiles.forEach((filePath) => {
            try {
                const data = serverUtils.json.readJSONFileSync(filePath) as any;
                addCatsFromObj(data);
                if (includeUnits && Array.isArray((data as any)?.units)) (data as any).units.forEach(addCatsFromObj);

                if (includeEntitiesMap) {
                    const relativePath = path.relative(this.resolved.dataDir, filePath);
                    const flat = new Set<string>();
                    const collectFrom = (obj: any) => {
                        if (obj?.categories) {
                            categoryKeys.forEach((key) => {
                                const v = obj.categories[key];
                                if (typeof v === "string" && v) flat.add(v);
                            });
                        }
                        if (includeTags && Array.isArray(obj?.tags)) obj.tags.forEach((t: string) => flat.add(t));
                    };
                    collectFrom(data);
                    if (includeUnits && Array.isArray((data as any)?.units)) (data as any).units.forEach(collectFrom);
                    entities.push({ filename: relativePath, categories: Array.from(flat).sort() });
                }
            } catch (e: any) {
                console.error(`Error processing ${filePath}: ${e.message}`);
            }
        });

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
            ? { categories: categoriesOut, entities: entities.sort((a, b) => a.filename.localeCompare(b.filename)) }
            : { categories: categoriesOut };

        const yamlContent = yaml.dump(payload, {
            indent: BUILD_CONFIG.yamlFormat.indent,
            lineWidth: BUILD_CONFIG.yamlFormat.lineWidth,
            sortKeys: BUILD_CONFIG.yamlFormat.sortKeys as boolean,
        });
        serverUtils.file.createDirIfNotExistsSync(path.dirname(categoriesPath));
        fs.writeFileSync(categoriesPath, yamlContent, "utf-8");
        console.log(`Categories file written to: ${categoriesPath}`);
    }
}

export class MethodsProcessor extends BaseModelMethodProcessor {
    private static defaultCategoryKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

    constructor(rootDir: string) {
        super({
            rootDir,
            entityName: "methods",
            assetsDir: BUILD_CONFIG.methods.assets.path,
            dataDir: BUILD_CONFIG.methods.data.path,
            buildDir: BUILD_CONFIG.methods.build?.path,
            distRuntimeDir: BUILD_CONFIG.runtimeDataDir,
            categoriesRelativePath: BUILD_CONFIG.methods.assets.categories,
            categoryKeys: MethodsProcessor.defaultCategoryKeys,
        });
    }

    // Put unit paths together and produce composite entity.path
    // eslint-disable-next-line class-methods-use-this
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

    // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
    protected getDataSubdirectory(_entity: any, sourceFile: string): string {
        const basename = path.basename(sourceFile, path.extname(sourceFile));
        return basename.replace(/_methods?$/i, "");
    }

    // enable units/tags scanning and entities list
    // eslint-disable-next-line class-methods-use-this
    protected getCategoryCollectOptions() {
        return { includeUnits: true, includeTags: true, includeEntitiesMap: true };
    }
}

export class ModelsProcessor extends BaseModelMethodProcessor {
    private static defaultCategoryKeys = ["tier1", "tier2", "tier3", "type", "subtype"];

    constructor(rootDir: string) {
        super({
            rootDir,
            entityName: "models",
            assetsDir: BUILD_CONFIG.models.assets.path,
            dataDir: BUILD_CONFIG.models.data.path,
            buildDir: BUILD_CONFIG.models.build?.path,
            distRuntimeDir: BUILD_CONFIG.runtimeDataDir,
            categoriesRelativePath: BUILD_CONFIG.models.assets.categories,
            categoryKeys: ModelsProcessor.defaultCategoryKeys,
        });
    }

    // eslint-disable-next-line class-methods-use-this
    protected getDataSubdirectory(entity: any): string {
        const fullPathAsURL = entity.path || "";
        const finalPath = fullPathAsURL.split("?")[0];
        return finalPath;
    }

    public updateCategoriesFile(): void {
        const dataPath = path.resolve(this.resolved.dataDir);
        const categoriesPath = path.resolve(
            resolveFromRoot(this.options.rootDir, BUILD_CONFIG.models.assets.path),
            BUILD_CONFIG.models.assets.categories,
        );
        const categoryKeys = ModelsProcessor.defaultCategoryKeys;

        const categorySets: Record<string, Set<string>> = Object.fromEntries(
            [...categoryKeys].map((k) => [k, new Set<string>()]),
        ) as any;

        const findJsonFilesRecursively = (dir: string): string[] => {
            const results: string[] = [];
            const items = fs.readdirSync(dir);
            items.forEach((item) => {
                const full = path.join(dir, item);
                const stat = fs.statSync(full);
                if (stat.isDirectory()) results.push(...findJsonFilesRecursively(full));
                else if (stat.isFile() && item.endsWith(".json")) results.push(full);
            });
            return results;
        };

        const jsonFiles = findJsonFilesRecursively(dataPath);
        jsonFiles.forEach((filePath) => {
            try {
                const data = serverUtils.json.readJSONFileSync(filePath) as any;
                if ((data as any)?.categories) {
                    categoryKeys.forEach((key) => {
                        const value = (data as any).categories[key];
                        if (typeof value === "string" && value) (categorySets as any)[key].add(value);
                    });
                }
            } catch (e: any) {
                console.error(`Error processing ${filePath}: ${e.message}`);
            }
        });

        const categoriesOut: any = {};
        categoryKeys.forEach((key) => {
            const arr = Array.from((categorySets as any)[key]).sort();
            if (arr.length > 0) categoriesOut[key] = arr;
        });

        const payload = { categories: categoriesOut };
        const yamlContent = yaml.dump(payload, {
            indent: BUILD_CONFIG.yamlFormat.indent,
            lineWidth: BUILD_CONFIG.yamlFormat.lineWidth,
            sortKeys: BUILD_CONFIG.yamlFormat.sortKeys as boolean,
        });
        serverUtils.file.createDirIfNotExistsSync(path.dirname(categoriesPath));
        fs.writeFileSync(categoriesPath, yamlContent, "utf-8");
        console.log(`Categories file written to: ${categoriesPath}`);
    }
}

export class WorkflowsProcessor extends EntityProcessor {
    constructor(rootDir: string) {
        super({
            rootDir,
            entityName: "workflows",
            assetsDir: BUILD_CONFIG.workflows.assets.path,
            dataDir: BUILD_CONFIG.workflows.data.path,
            buildDir: BUILD_CONFIG.workflows.build.path,
            distRuntimeDir: BUILD_CONFIG.runtimeDataDir,
        });
    }

    private applications: string[] = ["espresso"]; // TODO: derive dynamically
    private workflowSubforkflowMapByApplication: { workflows: Record<string, any>; subworkflows: Record<string, any> } =
        { workflows: {}, subworkflows: {} };

    public readAssets(): AssetRecord[] {
        const sourcesRoot = resolveFromRoot(this.options.rootDir, BUILD_CONFIG.workflows.assets.path);

        this.applications.forEach((name) => {
            this.workflowSubforkflowMapByApplication.workflows[name] = {};
            this.workflowSubforkflowMapByApplication.subworkflows[name] = {};

            const wfDir = path.resolve(sourcesRoot, BUILD_CONFIG.workflows.assets.workflows, name);
            const swDir = path.resolve(sourcesRoot, BUILD_CONFIG.workflows.assets.subworkflows, name);

            this.workflowSubforkflowMapByApplication.workflows[name] = loadYAMLFilesAsMap(wfDir);
            const wfCount = Object.keys(this.workflowSubforkflowMapByApplication.workflows[name]).length;
            console.log(`Building ${name}: ${wfCount} workflow(s)`);

            this.workflowSubforkflowMapByApplication.subworkflows[name] = loadYAMLFilesAsMap(swDir);
            const swCount = Object.keys(this.workflowSubforkflowMapByApplication.subworkflows[name]).length;
            console.log(`Building ${name}: ${swCount} subworkflow(s)`);
        });

        this.assets = [];
        return this.assets;
    }

    public writeBuildDirectoryContent(): void {
        if (!this.resolved.buildDir) return;
        const buildDir = this.resolved.buildDir as string;
        serverUtils.file.createDirIfNotExistsSync(buildDir);

        serverUtils.json.writeJSONFileSync(
            path.resolve(buildDir, BUILD_CONFIG.workflows.build.workflowSubforkflowMapByApplication),
            this.workflowSubforkflowMapByApplication,
        );
    }

    public writeDataDirectoryContent(): void {
        const WorkflowCls = Workflow as any;
        WorkflowCls.usePredefinedIds = true;

        const SubworkflowCls = Subworkflow as any;
        SubworkflowCls.usePredefinedIds = true;

        (builders as any).UnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssignmentUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).AssertionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).ExecutionUnitConfigBuilder.usePredefinedIds = true;
        (builders as any).IOUnitConfigBuilder.usePredefinedIds = true;

        (UnitFactory as any).BaseUnit.usePredefinedIds = true;
        (UnitFactory as any).AssignmentUnit.usePredefinedIds = true;
        (UnitFactory as any).AssertionUnit.usePredefinedIds = true;
        (UnitFactory as any).ExecutionUnit.usePredefinedIds = true;
        (UnitFactory as any).IOUnit.usePredefinedIds = true;
        (UnitFactory as any).SubworkflowUnit.usePredefinedIds = true;
        (UnitFactory as any).ConditionUnit.usePredefinedIds = true;
        (UnitFactory as any).MapUnit.usePredefinedIds = true;
        (UnitFactory as any).ProcessingUnit.usePredefinedIds = true;

        const workflowConfigs = createWorkflowConfigs({
            applications: this.applications,
            WorkflowCls,
            workflowSubforkflowMapByApplication: this.workflowSubforkflowMapByApplication,
            SubworkflowCls,
            UnitFactoryCls: UnitFactory,
            unitBuilders: {
                ...builders,
                Workflow: WorkflowCls,
            },
        } as any) as any[];

        const workflowItems = workflowConfigs.map((config: any) => ({
            appName: config.application,
            name: Utils.str.createSafeFilename(config.name),
            config: config.config,
        }));

        const outputWorkflowsDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.workflows);
        const outputSubworkflowsDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.subworkflows);
        serverUtils.file.createDirIfNotExistsSync(outputWorkflowsDir);
        serverUtils.file.createDirIfNotExistsSync(outputSubworkflowsDir);

        const generateConfigFiles = (
            items: { appName: string; name: string; config: any }[],
            type: "workflow" | "subworkflow",
        ) => {
            const baseDir = type === "workflow" ? outputWorkflowsDir : outputSubworkflowsDir;
            items.forEach((item) => {
                const appDir = path.resolve(baseDir, item.appName);
                serverUtils.file.createDirIfNotExistsSync(appDir);
                const filename = `${item.name}.json`;
                const filePath = path.resolve(appDir, filename);
                serverUtils.json.writeJSONFileSync(filePath, item.config, {
                    spaces: BUILD_CONFIG.jsonFormat.spaces,
                });
                console.log(`Generated ${type}: ${item.appName}/${filename}`);
            });
        };

        generateConfigFiles(workflowItems, "workflow");

        const subworkflowItems: { appName: string; name: string; config: any }[] = [];
        this.applications.forEach((appName) => {
            const subworkflows = this.workflowSubforkflowMapByApplication.subworkflows[appName];
            if (!subworkflows) return;

            Object.keys(subworkflows).forEach((subworkflowName) => {
                const subworkflow = createSubworkflowByName({
                    appName,
                    swfName: subworkflowName,
                    workflowsData: this.workflowSubforkflowMapByApplication,
                });
                subworkflowItems.push({
                    appName,
                    name: subworkflowName,
                    config: (subworkflow as any).toJSON(),
                });
            });
        });
        generateConfigFiles(subworkflowItems, "subworkflow");
    }

    public updateCategoriesFile(): void {
        const categoriesPathWf = path.resolve(
            resolveFromRoot(this.options.rootDir, BUILD_CONFIG.workflows.assets.path),
            BUILD_CONFIG.workflows.assets.workflowsCategories,
        );
        const categoriesPathSw = path.resolve(
            resolveFromRoot(this.options.rootDir, BUILD_CONFIG.workflows.assets.path),
            BUILD_CONFIG.workflows.assets.subworkflowsCategories,
        );

        const collect = (baseDir: string) => {
            const sets: Record<string, Set<string>> = { names: new Set<string>(), applications: new Set<string>() };
            const findJsonFilesRecursively = (dir: string): string[] => {
                const results: string[] = [];
                const items = fs.readdirSync(dir);
                items.forEach((item) => {
                    const full = path.join(dir, item);
                    const stat = fs.statSync(full);
                    if (stat.isDirectory()) results.push(...findJsonFilesRecursively(full));
                    else if (stat.isFile() && item.endsWith(".json")) results.push(full);
                });
                return results;
            };
            const files = findJsonFilesRecursively(baseDir);
            files.forEach((fp) => {
                const rel = path.relative(baseDir, fp);
                const [appName, fileName] = rel.split(path.sep);
                if (appName) sets.applications.add(appName);
                const nameNoExt = fileName?.replace(/\.json$/i, "");
                if (nameNoExt) sets.names.add(nameNoExt);
            });
            return sets;
        };

        const wfDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.workflows);
        const swDir = path.resolve(this.resolved.dataDir, BUILD_CONFIG.workflows.data.subworkflows);

        const wfSets = collect(wfDir);
        const swSets = collect(swDir);

        const dump = (targetPath: string, sets: Record<string, Set<string>>) => {
            const payload = {
                categories: {
                    applications: Array.from(sets.applications).sort(),
                    names: Array.from(sets.names).sort(),
                },
            };
            const yamlContent = yaml.dump(payload, {
                indent: BUILD_CONFIG.yamlFormat.indent,
                lineWidth: BUILD_CONFIG.yamlFormat.lineWidth,
                sortKeys: BUILD_CONFIG.yamlFormat.sortKeys as boolean,
            });
            serverUtils.file.createDirIfNotExistsSync(path.dirname(targetPath));
            fs.writeFileSync(targetPath, yamlContent, "utf-8");
            console.log(`Categories file written to: ${targetPath}`);
        };

        dump(categoriesPathWf, wfSets);
        dump(categoriesPathSw, swSets);
    }
}

export class ApplicationsProcessor extends EntityProcessor {
    constructor(rootDir: string) {
        super({
            rootDir,
            entityName: "applications",
            assetsDir: BUILD_CONFIG.applications.assets.path,
            dataDir: BUILD_CONFIG.applications.data.path,
            buildDir: BUILD_CONFIG.applications.build.path,
            distRuntimeDir: BUILD_CONFIG.runtimeDataDir,
            categoriesRelativePath: BUILD_CONFIG.applications.assets.categories,
        });
    }

    private cleanApplicationData: Record<string, ApplicationVersionsMapType> = {} as any;
    private modelFilterTree: Record<string, any> = {};
    private methodFilterTree: Record<string, any> = {};

    public readAssets(): AssetRecord[] {
        const sourcesRoot = resolveFromRoot(this.options.rootDir, BUILD_CONFIG.applications.assets.path);
        const applicationAssetPath = path.resolve(sourcesRoot, BUILD_CONFIG.applications.assets.applications);
        const modelAssetPath = path.resolve(sourcesRoot, BUILD_CONFIG.applications.assets.models);
        const methodAssetPath = path.resolve(sourcesRoot, BUILD_CONFIG.applications.assets.methods);

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const utilsCode = require("@mat3ra/code/dist/js/utils");
        const createObjectPathFromFilePath = utilsCode.createObjectPathFromFilePath as (
            fp: string,
            root: string,
        ) => string;

        const nestedApplicationData = loadYAMLTree(
            applicationAssetPath,
            createObjectPathFromFilePath,
        ) as Record<string, Record<string, ApplicationVersionsMapType>>;
        const clean = (Utils.object.flattenNestedObjects as any)(nestedApplicationData);

        this.cleanApplicationData = clean;
        this.modelFilterTree = loadYAMLTree(modelAssetPath, createObjectPathFromFilePath);
        this.methodFilterTree = loadYAMLTree(methodAssetPath, createObjectPathFromFilePath);
        this.assets = [];
        return this.assets;
    }

    public writeBuildDirectoryContent(): void {
        if (!this.resolved.buildDir) return;
        serverUtils.file.createDirIfNotExistsSync(this.resolved.buildDir);

        const targetBuildDir = this.resolved.buildDir as string;
        const workingDir = BUILD_CONFIG.applications.assets.path;
        buildJSONFromYAMLInDir({
            assetPath: BUILD_CONFIG.applications.assets.templates,
            targetPath: `${targetBuildDir}/${BUILD_CONFIG.applications.build.templatesList}`,
            workingDir,
            spaces: 0,
        });
        buildJSONFromYAMLInDir({
            assetPath: BUILD_CONFIG.applications.assets.executableTree,
            targetPath: `${targetBuildDir}/${BUILD_CONFIG.applications.build.executableFlavorMapByApplication}`,
            workingDir,
            spaces: 0,
        });

        serverUtils.json.writeJSONFileSync(
            path.resolve(targetBuildDir, BUILD_CONFIG.applications.build.applicationVersionsMapByApplication),
            this.cleanApplicationData,
        );

        const modelMethodMapByApplication = {
            models: this.modelFilterTree,
            methods: this.methodFilterTree,
        };
        serverUtils.json.writeJSONFileSync(
            path.resolve(targetBuildDir, BUILD_CONFIG.applications.build.modelMethodMapByApplication),
            modelMethodMapByApplication,
        );
    }

    public writeDataDirectoryContent(): void {
        const appNames = Object.keys(this.cleanApplicationData);
        appNames.forEach((appName) => {
            const applicationDataForVersions = this.cleanApplicationData[appName];
            const appVersionsMap = new ApplicationVersionsMap(applicationDataForVersions);
            const { versionConfigsFull } = appVersionsMap as any;

            const appDir = path.resolve(this.resolved.dataDir, appName);
            serverUtils.file.createDirIfNotExistsSync(appDir);
            versionConfigsFull.forEach((versionConfigFull: any) => {
                const fileName = (appVersionsMap as any).getSlugForVersionConfig(versionConfigFull);
                const filePath = path.resolve(appDir, fileName);
                serverUtils.json.writeJSONFileSync(filePath, versionConfigFull, {
                    spaces: BUILD_CONFIG.jsonFormat.spaces,
                });
                console.log(`Generated application version: ${appName}/${fileName}`);
            });
        });
    }
}
