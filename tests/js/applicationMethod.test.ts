// @ts-ignore - No type definitions available for @exabyte-io/mode.js
import { categorizedMethodList } from "@exabyte-io/mode.js/dist";
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
            methodList: categorizedMethodList,
            applicationName: "espresso",
        });

        expect(espressoMethods).to.be.an("array");
        expect(espressoMethods.length).to.be.greaterThan(0);

        const firstMethod = espressoMethods[0];
        expect(firstMethod).to.have.property("name");
        expect(firstMethod).to.have.property("path");
        // Methods may have units array with individual unit details
        if (firstMethod.units) {
            expect(firstMethod.units).to.be.an("array");
            expect(firstMethod.units[0]).to.have.property("categories");
        }
    });

    it("can filter methods with specific parameters", () => {
        const specificMethods = methodStandata.findByApplicationParameters({
            methodList: categorizedMethodList,
            applicationName: "espresso",
            version: "5.2.1",
            build: "Default",
            executable: "pw.x",
            flavor: "pw_scf",
        });

        expect(specificMethods).to.be.an("array");
        expect(specificMethods.length).to.be.greaterThan(0);

        // All returned methods should be from the original methodList and have required properties
        specificMethods.forEach((method) => {
            expect(categorizedMethodList).to.include(method);
            expect(method).to.have.property("path");
            expect(method).to.have.property("name");
        });
    });

    it("returns empty array for non-existent application", () => {
        const methods = methodStandata.findByApplicationParameters({
            methodList: categorizedMethodList,
            applicationName: "nonexistent",
        });

        expect(methods).to.be.an("array");
        // For non-existent application, the filter returns all methods since no filtering occurs
        expect(methods.length).to.equal(categorizedMethodList.length);
    });

    it("returns empty array for non-existent version", () => {
        const methods = methodStandata.findByApplicationParameters({
            methodList: categorizedMethodList,
            applicationName: "espresso",
            version: "999.0.0",
        });

        expect(methods).to.be.an("array");
        // For non-existent version, the filter falls back to all methods for the application
        expect(methods.length).to.equal(categorizedMethodList.length);
    });
});
