import { expect } from "chai";

import { ApplicationMethodStandata } from "../../src/js";

describe("Application Method Standata", () => {
    let methodStandata: ApplicationMethodStandata;

    beforeEach(() => {
        methodStandata = new ApplicationMethodStandata();
    });

    it("can get available methods for an application", () => {
        const availableMethods = methodStandata.getAvailableMethods("espresso");
        expect(availableMethods).to.be.an("object");
        expect(Object.keys(availableMethods)).to.include("5.2.1");
    });

    it("can find methods by application parameters", () => {
        const espressoMethods = methodStandata.findByApplicationParameters({
            applicationName: "espresso",
        });

        expect(espressoMethods).to.be.an("array");
        expect(espressoMethods.length).to.be.greaterThan(0);

        // Each method should have the expected structure
        const firstMethod = espressoMethods[0];
        expect(firstMethod).to.have.property("application", "espresso");
        expect(firstMethod).to.have.property("version");
        expect(firstMethod).to.have.property("build");
        expect(firstMethod).to.have.property("executable");
        expect(firstMethod).to.have.property("flavor");
        expect(firstMethod).to.have.property("path");
    });

    it("can filter methods with specific parameters", () => {
        const specificMethods = methodStandata.findByApplicationParameters({
            applicationName: "espresso",
            version: "5.2.1",
            build: "Default",
            executable: "pw.x",
            flavor: "pw_scf",
        });

        expect(specificMethods).to.be.an("array");
        expect(specificMethods.length).to.be.greaterThan(0);

        // All returned methods should match the specified parameters
        specificMethods.forEach((method) => {
            expect(method.application).to.equal("espresso");
            expect(method.version).to.equal("5.2.1");
            expect(method.build).to.equal("Default");
            expect(method.executable).to.equal("pw.x");
            expect(method.flavor).to.equal("pw_scf");
            // Methods can have either path or regex properties
            expect(method).to.satisfy((m: any) => m.path || m.regex);
        });
    });

    it("returns empty array for non-existent application", () => {
        const methods = methodStandata.findByApplicationParameters({
            applicationName: "nonexistent",
        });

        expect(methods).to.be.an("array");
        expect(methods).to.have.length(0);
    });

    it("returns empty array for non-existent version", () => {
        const methods = methodStandata.findByApplicationParameters({
            applicationName: "espresso",
            version: "999.0.0",
        });

        expect(methods).to.be.an("array");
        expect(methods).to.have.length(0);
    });
});
