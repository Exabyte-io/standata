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

const EXPECTED = {
    QUANTUM_MECHANICS: "quantum mechanics",
    DFT: "density functional theory",
    NORM_CONSERVING: "norm-conserving",
    PAW: "projector augmented wave",
    LONG_NAME: "long name",
    FILENAMES: ["aentity.json", "nested.json", "short.json", "zentity.json"],
    TAGS: ["t1", "t2", "t3"],
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
        writeEntity("aentity.json", { name: "A", type: "a", tags: ["t2", "t1"] });
        writeEntity("zentity.json", { name: "Z", type: "z" });
        writeEntity("short.json", { name: "Short", type: "short" });
        writeEntity("no-cats.json", { name: "Empty" });
        writeEntity("nested.json", {
            name: "Nested",
            categories: { tier1: "qm", type: "pw" },
            tags: ["t3"],
        });

        generateCategoriesFile({
            dataPath: DATA_DIR,
            categoriesYamlFilePath: CATEGORIES_FILE,
            categoryPathsInEntity: ["type", "tags", "categories.tier1", "categories.type"],
            shortToHumanReadableValueMap: { short: EXPECTED.LONG_NAME },
        });

        const result = readCategories();

        expect(result.categories.type).to.deep.equal(["a", EXPECTED.LONG_NAME, "pw", "z"]);
        expect(result.categories.tags).to.deep.equal(EXPECTED.TAGS);
        expect(result.categories.tier1).to.deep.equal(["qm"]);
        expect(result.entities.map((e: any) => e.filename)).to.deep.equal(EXPECTED.FILENAMES);
        expect(
            result.entities.find((e: any) => e.filename === "short.json").categories,
        ).to.deep.equal([EXPECTED.LONG_NAME]);
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

        expect(result.categories.tier1).to.include(EXPECTED.QUANTUM_MECHANICS);
        expect(result.categories.type).to.include.members([
            EXPECTED.DFT,
            EXPECTED.NORM_CONSERVING,
            EXPECTED.PAW,
            "unknown",
        ]);
        expect(
            result.entities.find((e: any) => e.filename === "method.json").categories,
        ).to.include.members([
            EXPECTED.QUANTUM_MECHANICS,
            EXPECTED.DFT,
            EXPECTED.NORM_CONSERVING,
            EXPECTED.PAW,
        ]);
    });
});
