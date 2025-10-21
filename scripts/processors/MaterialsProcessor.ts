// eslint-disable-next-line import/no-extraneous-dependencies
import serverUtils from "@mat3ra/utils/server";
import { execSync } from "child_process";
import * as path from "path";

import { BUILD_CONFIG } from "../../build-config";
import { CategorizedEntityProcessor } from "./CategorizedEntityProcessor";
import { AssetRecord } from "./EntityProcessor";

interface ManifestSource {
    filename: string;
    common_name: string;
    lattice_type: string;
    space_group: string;
    dimensionality: string;
    form_factor: string;
    source_id: string;
    source: string;
    doi: string;
    url: string;
    metadata?: any;
}

export class MaterialsProcessor extends CategorizedEntityProcessor {
    private static defaultCategoryKeys = [
        "common_name",
        "lattice_type",
        "dimensionality",
        "form_factor",
        "source",
    ];

    private manifestSources: ManifestSource[] = [];

    constructor(rootDir: string) {
        super({
            rootDir,
            entityNamePlural: "materials",
            assetsDir: BUILD_CONFIG.materials.assets.path,
            dataDir: BUILD_CONFIG.materials.data.path,
            buildDir: BUILD_CONFIG.materials.build?.path,
            categoriesRelativePath: BUILD_CONFIG.materials.assets.categories,
            categoryKeys: MaterialsProcessor.defaultCategoryKeys,
            excludedAssetFiles: [BUILD_CONFIG.materials.assets.manifest],
            categoryCollectOptions: {
                includeUnits: false,
                includeTags: true,
                includeEntitiesMap: true,
            },
        });
    }

    public readAssets(): AssetRecord[] {
        console.log("  Reading manifest and POSCAR files...");
        const manifestPath = path.resolve(
            this.resolvedPaths.assetsDir,
            BUILD_CONFIG.materials.assets.manifest,
        );
        const manifest = serverUtils.yaml.readYAMLFileSync(manifestPath) as {
            sources?: ManifestSource[];
        };
        this.manifestSources = manifest.sources || [];
        console.log(`  Found ${this.manifestSources.length} materials in manifest`);
        return [];
    }

    public writeDataDirectoryContent(): void {
        console.log("  Generating materials JSON from POSCAR files using Python (formatted)...");
        const scriptPath = path.resolve(__dirname, "../materials/create_materials.py");
        try {
            execSync(`python ${scriptPath}`, {
                cwd: path.resolve(__dirname, "../.."),
                stdio: "inherit",
            });
        } catch (error: any) {
            console.error("Error running materials Python script:", error.message);
            throw error;
        }
    }

    public writeBuildDirectoryContent(): void {
        console.log("  Copying materials to build directory (minified)...");
        this.copyAndMinifyFromDataToBuild();
    }

    public updateCategoriesFile(): void {
        console.log("  Skipping categories file update (manually maintained)");
    }
}
