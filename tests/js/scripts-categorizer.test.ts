import { expect } from "chai";
import * as fs from "fs";
import * as yaml from "js-yaml";
import * as path from "path";

import { BaseCategorizer } from "../../scripts/BaseCategorizer";
import { MethodModelCategorizer } from "../../scripts/MethodModelCategorizer";

describe("scripts/categorizers (compact)", () => {
    const TEST_DIR = path.join(__dirname, ".test-categorizer-temp");
    const DATA_DIR = path.join(TEST_DIR, "data");
    const CATEGORIES_FILE = path.join(TEST_DIR, "categories.yml");
    const w = (rel: string, obj: any) => {
        const p = path.join(DATA_DIR, rel);
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, JSON.stringify(obj));
    };
    const readYaml = () => yaml.load(fs.readFileSync(CATEGORIES_FILE, "utf-8")) as any;

    beforeEach(() => {
        if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
        fs.mkdirSync(DATA_DIR, { recursive: true });
    });
    afterEach(() => {
        if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
    });

    describe("BaseCategorizer", () => {
        it("extracts (top-level + nested), maps values, excludes empty, and sorts", () => {
            w("aentity.json", { name: "AEntity", type: "a", tags: ["t2", "t1"] });
            w("zentity.json", { name: "ZEntity", type: "z" });
            w("short.json", { name: "Short", type: "short" });
            w("no-cats.json", { name: "Lonely" }); // should be excluded
            w("nested.json", {
                name: "Nested",
                categories: { tier1: "qm", tier2: "wf", type: "pw" },
                tags: ["t3"],
            });

            const cat = new BaseCategorizer({
                dataPath: DATA_DIR,
                categoriesPath: CATEGORIES_FILE,
                categoryPaths: [
                    "type",
                    "tags",
                    "categories.tier1",
                    "categories.tier2",
                    "categories.type",
                ],
                valueMap: { short: "long readable name" },
            });
            cat.build();

            expect(fs.existsSync(CATEGORIES_FILE)).to.be.true;
            const res = readYaml();

            expect(res.categories.type).to.deep.equal(["a", "long readable name", "pw", "z"]);
            expect(res.categories.tags).to.deep.equal(["t1", "t2", "t3"]);
            expect(res.categories.tier1).to.deep.equal(["qm"]);
            expect(res.categories.tier2).to.deep.equal(["wf"]);

            // entities: all except "no-cats.json", sorted by filename
            expect(res.entities.map((e: any) => e.filename)).to.deep.equal([
                "aentity.json",
                "nested.json",
                "short.json",
                "zentity.json",
            ]);
            const shortEntry = res.entities.find((e: any) => e.filename === "short.json");
            expect(shortEntry.categories).to.deep.equal(["long readable name"]);
        });
    });

    describe("MethodModelCategorizer", () => {
        it("maps human-readable categories, pulls from units, preserves unknowns", () => {
            w("method.json", {
                name: "Method1",
                categories: { tier1: "qm", type: "dft" },
                units: [
                    { name: "u1", categories: { type: "nc" } },
                    { name: "u2", categories: { type: "paw" } },
                ],
            });
            w("unknown.json", { name: "Unknownish", categories: { type: "unknown_value" } });

            const cat = new MethodModelCategorizer({
                dataPath: DATA_DIR,
                categoriesPath: CATEGORIES_FILE,
                categoryPaths: ["categories.tier1", "categories.type"],
            });
            cat.build();

            const res = readYaml();

            expect(res.categories.tier1).to.include("quantum mechanics");
            expect(res.categories.type).to.include("density functional theory");
            expect(res.categories.type).to.include("unknown_value");

            const method = res.entities.find((e: any) => e.filename === "method.json");
            expect(method.categories).to.include("quantum mechanics");
        });
    });
});
