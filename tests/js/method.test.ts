import { expect } from "chai";

import { MethodStandata } from "../../src/js/method";
import { MethodConfig } from "../../src/js/types/method";

describe("MethodStandata", () => {
    let standata: MethodStandata;

    const mockMethods: MethodConfig[] = [
        {
            name: "DFT SCF",
            path: "/qm/dft/scf",
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
            name: "ML Regression",
            path: "/ml/regression/linear",
            units: [
                {
                    name: "linear_regression",
                    path: "/ml/linear/least_squares",
                    categories: {
                        type: { name: "Regression", slug: "regression" },
                        subtype: "linear",
                    },
                    parameters: { alpha: 0.1 },
                    tags: ["ml", "regression"],
                },
            ],
        },
    ];

    beforeEach(() => {
        standata = new MethodStandata();
        (standata as any).runtimeData = {
            standataConfig: {
                categories: {
                    type: ["pseudopotential", "regression"],
                    subtype: ["us", "linear"],
                    tags: ["scf", "dft", "ml", "regression"],
                },
                entities: mockMethods,
            },
            filesMapByName: {},
        };
    });

    describe("getByName", () => {
        it("should return method by name", () => {
            const method = standata.getByName("DFT SCF");

            expect(method).to.not.be.undefined;
            expect(method!.name).to.equal("DFT SCF");
        });
    });

    describe("getByUnitType", () => {
        it("should handle both string and object types", () => {
            const pseudoMethods = standata.getByUnitType("pseudopotential");
            const regressionMethods = standata.getByUnitType("regression");

            expect(pseudoMethods).to.have.length(1);
            expect(regressionMethods).to.have.length(1);
        });
    });

    describe("getByUnitSubtype", () => {
        it("should return methods by subtype", () => {
            const usMethods = standata.getByUnitSubtype("us");

            expect(usMethods).to.have.length(1);
            expect(usMethods[0].name).to.equal("DFT SCF");
        });
    });

    describe("getByUnitTags", () => {
        it("should return methods with specified tags", () => {
            const dftMethods = standata.getByUnitTags("dft");

            expect(dftMethods).to.have.length(1);
            expect(dftMethods[0].name).to.equal("DFT SCF");
        });
    });

    describe("getByPath", () => {
        it("should return methods by path", () => {
            const methods = standata.getByPath("/qm/dft/scf");

            expect(methods).to.have.length(1);
            expect(methods[0].name).to.equal("DFT SCF");
        });
    });

    describe("getByUnitParameters", () => {
        it("should return methods with matching parameters", () => {
            const methods = standata.getByUnitParameters({ ecutwfc: 40 });

            expect(methods).to.have.length(1);
            expect(methods[0].name).to.equal("DFT SCF");
        });
    });

    describe("utility methods", () => {
        it("should return all names and types", () => {
            const names = standata.getAllMethodNames();
            const types = standata.getUniqueUnitTypes();

            expect(names).to.include("DFT SCF");
            expect(names).to.include("ML Regression");
            expect(types).to.include("pseudopotential");
            expect(types).to.include("regression");
        });
    });

    describe("model compatibility integration", () => {
        it("should integrate with ModelMethodFilter", () => {
            const mockModel = {
                name: "Test Model",
                path: "/models/test",
                categories: {
                    tier1: "pb",
                    tier2: "qm",
                    tier3: "dft",
                    type: "ksdft",
                    subtype: "gga",
                },
            };

            // Should not throw and return an array
            const compatibleMethods = standata.getCompatibleWithModel(mockModel);
            expect(compatibleMethods).to.be.an("array");
        });
    });
});
