import { expect } from "chai";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

import { generateCategoriesFile } from "../../scripts/categoriesUtils";

const METHOD_MODEL_VALUE_MAP: Record<string, string> = {
    qm: "quantum mechanics",
    dft: "density functional theory",
    nc: "norm-conserving",
    paw: "projector augmented wave",
};

const VALUES = {
    QUANTUM_MECHANICS: "quantum mechanics",
    DFT: "density functional theory",
    NORM_CONSERVING: "norm-conserving",
    PAW: "projector augmented wave",
    LONG_NAME: "long name",
    TAGS: ["t1", "t2", "t3"],
};

const FILENAMES = {
    A_SORTED_NAME_ENTITY: "a-sorted-name-entity.json",
    NESTED_ENTITY: "nested.json",
    Z_SORTED_NAME_ENTITY: "z-sorted-name-entity.json",
    NO_CATEGORIES: "no-categories.json",
};

describe("categoriesUtils", () => {
    const TEST_DIR = path.join(__dirname, ".test-categorizer-temp");
    const DATA_DIR = path.join(TEST_DIR, "data");
    const CATEGORIES_FILE = path.join(TEST_DIR, "categories.yml");

    const writeEntity = (filename: string, data: any) => {
        const filepath = path.join(DATA_DIR, filename);
        fs.mkdirSync(path.dirname(filepath), { recursive: true });
        fs.writeFileSync(filepath, JSON.stringify(data));
    };
    const readCategories = () => yaml.load(fs.readFileSync(CATEGORIES_FILE, "utf-8")) as any;

    beforeEach(() => {
        if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
        fs.mkdirSync(DATA_DIR, { recursive: true });
    });
    afterEach(() => fs.existsSync(TEST_DIR) && fs.rmSync(TEST_DIR, { recursive: true }));

    it("extracts categories, maps values, excludes empty entities, and sorts", () => {
        writeEntity(FILENAMES.A_SORTED_NAME_ENTITY, { name: "A", type: "a", tags: ["t2", "t1"] });
        writeEntity(FILENAMES.Z_SORTED_NAME_ENTITY, { name: "Z", type: "z" });
        writeEntity(FILENAMES.NO_CATEGORIES, { name: "Empty" });
        writeEntity(FILENAMES.NESTED_ENTITY, {
            name: "Nested",
            categories: { tier1: "qm", type: "pw" },
            tags: ["t3"],
        });

        generateCategoriesFile({
            dataPath: DATA_DIR,
            categoriesYamlFilePath: CATEGORIES_FILE,
            categoryPathsInEntity: ["type", "tags", "categories.tier1", "categories.type"],
            shortToHumanReadableValueMap: { short: VALUES.LONG_NAME },
        });

        const result = readCategories();

        expect(result.categories.type).to.deep.equal(["a", VALUES.LONG_NAME, "pw", "z"]);
        expect(result.categories.tags).to.deep.equal(VALUES.TAGS);
        expect(result.categories.tier1).to.deep.equal(["qm"]);
        expect(result.entities.map((e: any) => e.filename)).to.deep.equal([
            FILENAMES.A_SORTED_NAME_ENTITY,
            FILENAMES.NESTED_ENTITY,
            FILENAMES.Z_SORTED_NAME_ENTITY,
        ]);
    });

    it("extracts from units array and applies value mappings", () => {
        writeEntity("method.json", {
            name: "Method",
            categories: { tier1: "qm", type: "dft" },
            units: [{ categories: { type: "nc" } }, { categories: { type: "paw" } }],
        });
        writeEntity("model.json", { name: "Model", categories: { type: "unknown" } });

        generateCategoriesFile({
            dataPath: DATA_DIR,
            categoriesYamlFilePath: CATEGORIES_FILE,
            categoryPathsInEntity: ["categories.tier1", "categories.type"],
            shortToHumanReadableValueMap: METHOD_MODEL_VALUE_MAP,
        });

        const result = readCategories();

        expect(result.categories.tier1).to.include(VALUES.QUANTUM_MECHANICS);
        expect(result.categories.type).to.include.members([
            VALUES.DFT,
            VALUES.NORM_CONSERVING,
            VALUES.PAW,
            "unknown",
        ]);
        expect(
            result.entities.find((e: any) => e.filename === "method.json").categories,
        ).to.include.members([
            VALUES.QUANTUM_MECHANICS,
            VALUES.DFT,
            VALUES.NORM_CONSERVING,
            VALUES.PAW,
        ]);
    });
});
