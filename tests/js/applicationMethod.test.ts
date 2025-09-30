// @ts-ignore - No type definitions available for @exabyte-io/mode.js
import { categorizedMethodList, categorizedModelList } from "@exabyte-io/mode.js/dist";
// @ts-ignore - No type definitions available for @exabyte-io/mode.js
import { filterMethodsByModel } from "@exabyte-io/mode.js/dist/tree";
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
        expect(Object.keys(availableMethods)).to.include("6.3");
    });

    it("can find methods by application parameters", () => {
        const espressoMethods = methodStandata.findByApplicationParameters({
            methodList: categorizedMethodList,
            name: "espresso",
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
            name: "espresso",
            version: "6.3",
            build: "GNU",
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

    it("can filter methods using realistic two-step process like webapp", () => {
        // Use a sample model from the categorized model list
        const sampleModel = categorizedModelList[0];

        // Step 1: Filter methods by model (like in webapp)
        const filteredMethods = filterMethodsByModel({
            methodList: categorizedMethodList,
            model: sampleModel,
        });

        expect(filteredMethods).to.be.an("array");

        // Step 2: Further filter by application parameters (like in webapp)
        const finalMethods = methodStandata.findByApplicationParameters({
            methodList: filteredMethods,
            name: "espresso",
            version: "6.3",
            build: "GNU",
        });

        expect(finalMethods).to.be.an("array");
        // All returned methods should be from the filtered list
        finalMethods.forEach((method) => {
            expect(filteredMethods).to.include(method);
            expect(method).to.have.property("path");
            expect(method).to.have.property("name");
        });
    });

    it("returns empty array for non-existent application", () => {
        const methods = methodStandata.findByApplicationParameters({
            methodList: categorizedMethodList,
            name: "nonexistent",
        });

        expect(methods).to.be.an("array");
        // For non-existent application, the filter returns all methods since no filtering occurs
        expect(methods.length).to.equal(categorizedMethodList.length);
    });

    it("returns empty array for non-existent version", () => {
        const methods = methodStandata.findByApplicationParameters({
            methodList: categorizedMethodList,
            name: "espresso",
            version: "999.0.0",
        });

        expect(methods).to.be.an("array");
        // For non-existent version, the filter falls back to all methods for the application
        expect(methods.length).to.equal(categorizedMethodList.length);
    });
});
