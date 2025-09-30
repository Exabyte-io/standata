import { expect } from "chai";

import { ModelMethodFilter, ModelMethodFilterEntry } from "../../src/js/modelMethodFilter";
import { MethodConfig } from "../../src/js/types/method";
import { ModelConfig } from "../../src/js/types/model";

describe("ModelMethodFilter", () => {
    let filter: ModelMethodFilter;

    const mockMethods: MethodConfig[] = [
        {
            name: "DFT Method",
            path: "/qm/dft/gga/pbe",
            units: [
                {
                    name: "pw_scf",
                    path: "/qm/wf/none/pw/none",
                    categories: {
                        type: "pseudopotential",
                        subtype: "us",
                    },
                    parameters: { ecutwfc: 40 },
                    tags: ["scf", "dft"],
                },
            ],
        },
        {
            name: "ML Method",
            path: "/ml/regression/linear",
            units: [
                {
                    name: "linear_regression",
                    path: "/ml/linear/least_squares",
                    categories: {
                        type: "regression",
                        subtype: "linear",
                    },
                    parameters: { alpha: 0.1 },
                    tags: ["ml", "regression"],
                },
            ],
        },
    ];

    const mockFilterMap: ModelMethodFilterEntry[] = [
        {
            modelCategories: {
                tier1: "pb",
                tier2: "qm",
                tier3: "dft",
                type: "ksdft",
                subtype: "gga",
            },
            filterRules: [{ path: "/qm/wf/none/pw/none" }, { regex: "/qm/wf/none/psp/.*" }],
        },
        {
            modelCategories: {
                tier1: "st",
                tier2: "det",
                tier3: "ml",
            },
            filterRules: [{ path: "/ml/linear/least_squares" }, { regex: "/ml/.*/regression" }],
        },
    ];

    beforeEach(() => {
        filter = new ModelMethodFilter();
        (filter as any).filterMap = mockFilterMap;
    });

    describe("getCompatibleMethods", () => {
        it("should return compatible methods for DFT model", () => {
            const model: ModelConfig = {
                name: "DFT Model",
                path: "/models/dft/gga",
                categories: {
                    tier1: "pb",
                    tier2: "qm",
                    tier3: "dft",
                    type: "ksdft",
                    subtype: "gga",
                },
            };

            const compatibleMethods = filter.getCompatibleMethods(model, mockMethods);

            expect(compatibleMethods).to.have.length(1);
            expect(compatibleMethods[0].name).to.equal("DFT Method");
        });

        it("should return empty array for unknown model", () => {
            const model: ModelConfig = {
                name: "Unknown Model",
                path: "/models/unknown",
                categories: {
                    tier1: "unknown",
                    tier2: "unknown",
                    tier3: "unknown",
                    type: "unknown",
                    subtype: "unknown",
                },
            };

            const compatibleMethods = filter.getCompatibleMethods(model, mockMethods);
            expect(compatibleMethods).to.have.length(0);
        });
    });

    describe("categoriesMatch", () => {
        it("should match exact categories", () => {
            const modelCategories = {
                tier1: "pb",
                tier2: "qm",
                tier3: "dft",
                type: "ksdft",
                subtype: "gga",
            };

            const filterCategories = {
                tier1: "pb",
                tier2: "qm",
                tier3: "dft",
                type: "ksdft",
                subtype: "gga",
            };

            const matches = (filter as any).categoriesMatch(modelCategories, filterCategories);
            expect(matches).to.be.true;
        });

        it("should handle wildcard matching", () => {
            const modelCategories = {
                tier1: "pb",
                tier2: "qm",
                tier3: "dft",
                type: "ksdft",
                subtype: "gga",
            };

            const filterCategories = {
                tier1: "pb",
                tier2: "qm",
                tier3: "dft",
                // type and subtype undefined = wildcards
            };

            const matches = (filter as any).categoriesMatch(modelCategories, filterCategories);
            expect(matches).to.be.true;
        });
    });

    describe("utility methods", () => {
        it("should extract filter rules and paths", () => {
            const allRules = filter.getAllFilterRules();
            const paths = filter.getUniqueFilterPaths();

            expect(allRules.length).to.be.greaterThan(0);
            expect(paths).to.include("/qm/wf/none/pw/none");
            expect(paths).to.include("/ml/linear/least_squares");
        });
    });

    describe("edge cases", () => {
        it("should handle invalid regex gracefully", () => {
            const invalidFilterMap: ModelMethodFilterEntry[] = [
                {
                    modelCategories: { tier1: "test" },
                    filterRules: [{ regex: "[invalid" }],
                },
            ];

            (filter as any).filterMap = invalidFilterMap;

            const model: ModelConfig = {
                name: "Test Model",
                path: "/test",
                categories: { tier1: "test" },
            };

            const result = filter.getCompatibleMethods(model, mockMethods);
            expect(result).to.be.an("array");
        });
    });
});
