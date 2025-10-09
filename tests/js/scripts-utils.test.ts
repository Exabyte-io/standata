import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";

import {
    buildJsonFromYamlInDir,
    clearDirectory,
    createSafeFilename,
    findFiles,
    loadYAMLTree,
    readJSONFile,
    readYAMLFile,
    writeJSONFile,
    writeYAMLFile,
} from "../../scripts/utils";

describe("scripts/utils (compact)", () => {
    const TEST_DIR = path.join(__dirname, ".test-temp");
    beforeEach(() => {
        if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
        fs.mkdirSync(TEST_DIR, { recursive: true });
    });
    afterEach(() => {
        if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
    });

    it("reads/writes YAML & JSON with spacing and parent dirs", () => {
        const yObj = { a: 1, b: { c: 2 }, arr: [1, 2] };
        const yPath = path.join(TEST_DIR, "nested/dir/test.yml");
        writeYAMLFile(yPath, yObj);
        expect(fs.existsSync(yPath)).to.be.true;
        expect(readYAMLFile(yPath)).to.deep.equal(yObj);

        const jObj = { x: 1, y: 2 };
        const jMin = path.join(TEST_DIR, "m.json");
        const jPretty = path.join(TEST_DIR, "p.json");
        writeJSONFile(jMin, jObj, 0);
        writeJSONFile(jPretty, jObj, 2);
        expect(readJSONFile(jMin)).to.deep.equal(jObj);
        const min = fs.readFileSync(jMin, "utf-8");
        const pretty = fs.readFileSync(jPretty, "utf-8");
        expect(min).to.equal('{"x":1,"y":2}');
        expect(pretty).to.include("\n");
    });

    it("findFiles recurses and filters by extension", () => {
        const mk = (p: string) => {
            const d = path.dirname(p);
            fs.mkdirSync(d, { recursive: true });
            fs.writeFileSync(p, "");
        };
        ["file1.txt", "file2.yml", "sub/file3.yaml", "sub/inner/file4.json"].forEach((f) =>
            mk(path.join(TEST_DIR, f)),
        );
        expect(findFiles(TEST_DIR, [".yml", ".yaml"]).length).to.equal(2);
        expect(findFiles(TEST_DIR, [".txt"]).length).to.equal(1);
        expect(findFiles(TEST_DIR, [".json", ".txt", ".yml", ".yaml"]).length).to.equal(4);
    });

    it("clearDirectory honors exclude and clears all", () => {
        ["a.txt", "keep.txt", "sub/b.txt"].forEach((f) => {
            const p = path.join(TEST_DIR, f);
            fs.mkdirSync(path.dirname(p), { recursive: true });
            fs.writeFileSync(p, "x");
        });
        clearDirectory(TEST_DIR, "keep.txt");
        const items = fs.readdirSync(TEST_DIR).sort();
        expect(items).to.deep.equal(["keep.txt"]);
        clearDirectory(TEST_DIR);
        expect(fs.readdirSync(TEST_DIR)).to.deep.equal([]);
    });

    it("createSafeFilename covers key transformations", () => {
        expect(createSafeFilename("UPPERCASE")).to.equal("uppercase");
        expect(createSafeFilename("hello world")).to.equal("hello_world");
        expect(createSafeFilename("test---file")).to.equal("test_file");
        expect(createSafeFilename("---test---")).to.equal("test");
        expect(createSafeFilename("DFT-LDA-PZ (U+SOC)")).to.equal("dft_lda_pz_u_soc");
        expect(createSafeFilename("Si [100] Surface")).to.equal("si_100_surface");
        expect(createSafeFilename("test123abc")).to.equal("test123abc");
    });

    it("buildJsonFromYamlInDir converts YAML->JSON (spacing=0)", () => {
        const yPath = path.join(TEST_DIR, "s.yml");
        const jPath = path.join(TEST_DIR, "o.json");
        const obj = { name: "t", value: 1 };
        writeYAMLFile(yPath, obj);
        const out = buildJsonFromYamlInDir({
            assetPath: yPath,
            targetPath: jPath,
            workingDir: TEST_DIR,
            spaces: 0,
        });
        expect(out).to.deep.equal(obj);
        expect(fs.existsSync(jPath)).to.be.true;
        expect(fs.readFileSync(jPath, "utf-8")).to.equal('{"name":"t","value":1}');
    });

    it("loadYamlTree aggregates nested YAML", () => {
        const data = { lda: { type: "lda" }, gga: { type: "gga" } };
        writeYAMLFile(path.join(TEST_DIR, "models/espresso/lda.yml"), data.lda);
        writeYAMLFile(path.join(TEST_DIR, "models/espresso/gga.yml"), data.gga);
        const mapPath = (f: string, root: string) =>
            path
                .relative(root, f)
                .split(path.sep)
                .map((p) => p.replace(/\.(yml|yaml)$/i, ""))
                .join(".");
        const tree = loadYAMLTree(TEST_DIR, mapPath);
        expect(tree).to.have.nested.property("models.espresso.lda");
        expect(tree.models.espresso.lda).to.deep.equal(data.lda);
        expect(tree.models.espresso.gga).to.deep.equal(data.gga);
    });
});
