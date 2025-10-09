import { expect } from "chai";

import { MethodStandata } from "../../src/js";

// Test data constants
const TEST_METHOD_NAMES = {
    NC_CG_GAUSSIAN:
        "Plane-wave Norm-conserving Pseudopotential (Conjugate Gradient Diagonalization, Gaussian Smearing)",
    NC_CG_LINEAR_TETRAHEDRON:
        "Plane-wave Norm-conserving Pseudopotential (Conjugate Gradient Diagonalization, Linear Tetrahedron Method)",
} as const;

const TEST_UNIT_TYPES = {
    PW: "pw",
    PSP: "psp",
    CG: "cg",
} as const;

const TEST_UNIT_SUBTYPES = {
    GAUSSIAN: "gaussian",
    LINEAR: "linear",
} as const;

const TEST_UNIT_TAGS = {
    PLANE_WAVE: "plane wave",
} as const;

const TEST_PATHS = {
    NC_CG_GAUSSIAN:
        "/qm/wf/none/smearing/gaussian::/opt/diff/ordern/cg/none::/qm/wf/none/psp/nc::/qm/wf/none/pw/none",
    NC_CG_LINEAR_TETRAHEDRON:
        "/qm/wf/none/tetrahedron/linear::/opt/diff/ordern/cg/none::/qm/wf/none/psp/nc::/qm/wf/none/pw/none",
} as const;

const TEST_COUNTS = {
    TOTAL_PW_METHODS: 2, // Minimal config: nc with gaussian and linear
    TOTAL_CG_METHODS: 2, // Only CG diagonalization in minimal config
    TOTAL_GAUSSIAN_METHODS: 1, // Only nc + cg + gaussian
    TOTAL_LINEAR_METHODS: 1, // Only nc + cg + linear
} as const;

describe("MethodStandata", () => {
    let standata: MethodStandata;

    beforeEach(() => {
        standata = new MethodStandata();
        const originalGetAll = standata.getAll.bind(standata);
        standata.getAll = () => originalGetAll().filter((method) => method.units);
    });

    describe("getByName", () => {
        it("should return method by name", () => {
            const method = standata.getByName(TEST_METHOD_NAMES.NC_CG_GAUSSIAN);

            expect(method).to.not.be.undefined;
            expect(method!.name).to.equal(TEST_METHOD_NAMES.NC_CG_GAUSSIAN);
        });
    });

    describe("getByUnitType", () => {
        it("should handle both string and object types", () => {
            const pwMethods = standata.getByUnitType(TEST_UNIT_TYPES.PW);
            const cgMethods = standata.getByUnitType(TEST_UNIT_TYPES.CG);

            expect(pwMethods).to.have.length(TEST_COUNTS.TOTAL_PW_METHODS);
            expect(cgMethods).to.have.length(TEST_COUNTS.TOTAL_CG_METHODS);
        });
    });

    describe("getByUnitSubtype", () => {
        it("should return methods by subtype", () => {
            const gaussianMethods = standata.getByUnitSubtype(TEST_UNIT_SUBTYPES.GAUSSIAN);

            expect(gaussianMethods).to.have.length(TEST_COUNTS.TOTAL_GAUSSIAN_METHODS);
            expect(gaussianMethods[0].name).to.include("Gaussian");
        });
    });

    describe("getByUnitTags", () => {
        it("should return methods with specified tags", () => {
            const planeWaveMethods = standata.getByUnitTags(TEST_UNIT_TAGS.PLANE_WAVE);

            expect(planeWaveMethods).to.have.length(TEST_COUNTS.TOTAL_PW_METHODS);
            expect(planeWaveMethods[0].name).to.include("Plane-wave");
        });
    });

    describe("getByPath", () => {
        it("should return methods by path", () => {
            const methods = standata.getByPath(TEST_PATHS.NC_CG_GAUSSIAN);

            expect(methods).to.have.length(1);
            expect(methods[0].name).to.include("Gaussian");
        });
    });

    describe("getByUnitParameters", () => {
        it("should return methods with matching parameters", () => {
            // Empty object {} matches any method that has parameters
            // Minimal config has no methods with parameters (local_orbital removed)
            const methodsWithParams = standata.getByUnitParameters({});
            expect(methodsWithParams).to.have.length(0);

            // Test specific parameter matching - no Pople methods in minimal config
            const popleMethods = standata.getByUnitParameters({ basisSlug: "6-31G" });
            expect(popleMethods).to.have.length(0);
        });
    });

    describe("utility methods", () => {
        it("should return all names and types", () => {
            const names = standata.getAllMethodNames();
            const types = standata.getUniqueUnitTypes();

            expect(names).to.include(TEST_METHOD_NAMES.NC_CG_GAUSSIAN);
            expect(names).to.include(TEST_METHOD_NAMES.NC_CG_LINEAR_TETRAHEDRON);
            expect(types).to.include(TEST_UNIT_TYPES.PW);
            expect(types).to.include(TEST_UNIT_TYPES.CG);
            expect(types).to.include(TEST_UNIT_TYPES.PSP);
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

    describe("error handling for missing units", () => {
        let standataWithMissingUnits: MethodStandata;

        beforeEach(() => {
            standataWithMissingUnits = new MethodStandata();
            standataWithMissingUnits.getAll = () => [
                { name: "Invalid Method", path: "/invalid", units: undefined } as any,
            ];
        });

        it("should throw error in getByUnitType when method has no units", () => {
            expect(() => standataWithMissingUnits.getByUnitType(TEST_UNIT_TYPES.PW)).to.throw(
                'Method "Invalid Method" has no units defined',
            );
        });
    });
});
