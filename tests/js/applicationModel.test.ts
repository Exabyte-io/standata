import { expect } from "chai";

import { ApplicationModelStandata } from "../../src/js";

describe("Application Model Standata", () => {
    let modelStandata: ApplicationModelStandata;

    beforeEach(() => {
        modelStandata = new ApplicationModelStandata();
    });

    it("can get available models for an application", () => {
        const availableModels = modelStandata.getAvailableModels("espresso");
        expect(availableModels).to.be.an("object");
        expect(Object.keys(availableModels)).to.include("5.2.1");
    });

    it("can find models by application parameters", () => {
        const espressoModels = modelStandata.findByApplicationParameters({
            applicationName: "espresso",
        });

        expect(espressoModels).to.be.an("array");
        expect(espressoModels.length).to.be.greaterThan(0);

        // Each model should have the expected structure
        const firstModel = espressoModels[0];
        expect(firstModel).to.have.property("application", "espresso");
        expect(firstModel).to.have.property("version");
        expect(firstModel).to.have.property("build");
        expect(firstModel).to.have.property("executable");
        expect(firstModel).to.have.property("flavor");
        expect(firstModel).to.have.property("path");
    });

    it("can filter models with specific parameters", () => {
        const specificModels = modelStandata.findByApplicationParameters({
            applicationName: "espresso",
            version: "5.2.1",
            build: "Default",
            executable: "pw.x",
            flavor: "pw_scf",
        });

        expect(specificModels).to.be.an("array");
        expect(specificModels.length).to.be.greaterThan(0);

        // All returned models should match the specified parameters
        specificModels.forEach((model) => {
            expect(model.application).to.equal("espresso");
            expect(model.version).to.equal("5.2.1");
            expect(model.build).to.equal("Default");
            expect(model.executable).to.equal("pw.x");
            expect(model.flavor).to.equal("pw_scf");
            expect(model).to.have.property("path");
        });
    });

    it("returns empty array for non-existent application", () => {
        const models = modelStandata.findByApplicationParameters({
            applicationName: "nonexistent",
        });

        expect(models).to.be.an("array");
        expect(models).to.have.length(0);
    });
});
