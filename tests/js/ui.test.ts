import { expect } from "chai";

// @ts-ignore
import type { TreeNode } from "../../ui/types/uiTree";

import baseUiSchemas from "../../dist/js/ui/schemas.json";
import methodTree from "../../dist/js/ui/methodTree.json";
import modelTree from "../../dist/js/ui/modelTree.json";

function validateTree(tree: TreeNode): void {
    expect(tree.path).to.be.a("string");
    expect(tree.data === null || typeof tree.data?.key === "string").to.be.true;

    if (tree.data) {
        expect(tree.data.value).to.be.a("string");
        expect(tree.data.name).to.be.a("string");
    }

    if (tree.children) {
        tree.children.forEach(validateTree);
    }

    if (tree.staticOptions) {
        tree.staticOptions.forEach((opt) => {
            expect(opt.key).to.be.a("string");
            expect(opt.values).to.be.an("array");
            if (opt.namesMap) {
                Object.keys(opt.namesMap).forEach((k) => expect(opt.values).to.include(k));
            }
        });
    }
}

describe("UI Trees", () => {
    [
        { name: "modelTree", tree: modelTree, expectedCategories: ["pb"] },
        { name: "methodTree", tree: methodTree, expectedCategories: ["qm", "linalg", "opt"] },
    ].forEach(({ name, tree, expectedCategories }) => {
        describe(name, () => {
            it("should have valid structure", () => {
                expect(tree.path).to.equal("/");
                expect(tree.data).to.be.null;
                expect(tree.children).to.be.an("array").and.not.empty;
                validateTree(tree);
            });

            it("should include expected categories", () => {
                const tier1Values = tree.children?.map((c) => c.data?.value);
                expect(tier1Values).to.include.members(expectedCategories);
            });
        });
    });

    describe("baseUiSchemas", () => {
        it("should have required sections", () => {
            expect(baseUiSchemas).to.have.all.keys([
                "categories",
                "modelParameters",
                "methodParameters",
            ]);
        });

        it("should have ui:title properties", () => {
            Object.values(baseUiSchemas.categories).forEach((prop: any) => {
                expect(prop).to.have.property("ui:title");
            });
        });
    });
});
