import { expect } from "chai";

import { ModelStandata } from "../../src/js/model";
import { ModelConfig } from "../../src/js/types/model";

describe("ModelStandata", () => {
    let standata: ModelStandata;

    const mockModels: ModelConfig[] = [
        {
            name: "DFT GGA",
            path: "/models/dft/gga/pbe",
            categories: {
                tier1: "pb",
                tier2: "qm",
                tier3: "dft",
                type: "ksdft",
                subtype: "gga",
            },
        },
        {
            name: "ML Regression",
            path: "/models/ml/regression/linear",
            categories: {
                tier1: "st",
                tier2: "det",
                tier3: "ml",
                type: "regression",
                subtype: "linear",
            },
        },
    ];

    beforeEach(() => {
        standata = new ModelStandata();
        (standata as any).runtimeData = {
            standataConfig: {
                categories: {
                    tier1: ["pb", "st"],
                    tier2: ["qm", "det"],
                    tier3: ["dft", "ml"],
                    type: ["ksdft", "regression"],
                    subtype: ["gga", "linear"],
                    tags: ["quantum", "classical", "dft", "ml"],
                },
                entities: mockModels,
            },
            filesMapByName: {},
        };
    });

    describe("getByTags", () => {
        it("should find models by category tags", () => {
            const dftModels = standata.getByTags("dft");
            const mlModels = standata.getByTags("ml");

            expect(dftModels).to.have.length(1);
            expect(dftModels[0].name).to.equal("DFT GGA");
            expect(mlModels).to.have.length(1);
            expect(mlModels[0].name).to.equal("ML Regression");
        });

        it("should find models by multiple tags", () => {
            const models = standata.getByTags("gga", "linear");

            expect(models).to.have.length(2);
        });
    });

    describe("hierarchical categories", () => {
        it("should have proper category structure", () => {
            const allModels = standata.getAll();

            expect(
                allModels.every(
                    (m) =>
                        m.categories.tier1 &&
                        m.categories.tier2 &&
                        m.categories.tier3 &&
                        m.categories.type &&
                        m.categories.subtype,
                ),
            ).to.be.true;
        });
    });

    describe("integration", () => {
        it("should work with filtering systems", () => {
            const dftModel = standata.getByTags("dft")[0];

            expect(dftModel.categories.tier1).to.equal("pb");
            expect(dftModel.categories.tier2).to.equal("qm");
            expect(dftModel.categories.tier3).to.equal("dft");
        });
    });
});
