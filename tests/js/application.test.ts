import { expect } from "chai";

import { ApplicationStandata } from "../../src/js";
import { ApplicationVersionsMap } from "../../src/js/utils/applicationVersionMap";
import applicationVersionsMapByApplication from "./fixtures/applicationVersionsMapByApplication.json";
import EspressoGnu63 from "./fixtures/espresso_gnu_6.3.json";

describe("ApplicationVersionsMap", () => {
    it("should correctly instantiate from JSON data", () => {
        const espressoVersionsMap = new ApplicationVersionsMap(
            applicationVersionsMapByApplication.espresso,
        );
        expect(espressoVersionsMap).to.be.an.instanceof(ApplicationVersionsMap);
        expect(espressoVersionsMap.versions).to.be.an("array");
        expect(espressoVersionsMap.getSlugForVersionConfig(EspressoGnu63)).to.equal(
            "espresso_gnu_6.3.json",
        );
        expect(espressoVersionsMap.defaultVersion).to.equal("6.3");
        expect(espressoVersionsMap.name).to.equal("espresso");
        expect(espressoVersionsMap.shortName).to.equal("qe");
        expect(espressoVersionsMap.versionConfigsFull.length).to.not.equal(0);
    });
});

describe("Application Standata", () => {
    let standata: ApplicationStandata;

    beforeEach(() => {
        standata = new ApplicationStandata();
    });

    describe("Basic Standata methods", () => {
        it("can search applications by tags", () => {
            const tags = ["quantum-mechanical"];
            const entities = standata.findEntitiesByTags(...tags);
            expect(entities).to.deep.include.members([EspressoGnu63]);
            expect(entities.length).to.be.greaterThan(0);
        });

        it("can find espresso applications", () => {
            const espressoApps = standata.findEntitiesByTags("quantum-mechanical");
            expect(espressoApps).to.be.an("array");
            expect(espressoApps.length).to.be.greaterThan(0);
            expect(espressoApps[0]).to.have.property("name", "espresso");
        });
    });

    describe("Application-specific methods", () => {
        it("getApplication - resolves default version and build from application config", () => {
            const app = standata.getApplication({ name: "espresso" });
            expect(app).to.have.property("name", "espresso");
            expect(app).to.have.property("shortName", "qe");
            expect(app).to.have.property("version", "6.3");
            expect(app).to.have.property("build", "GNU");
        });

        it("getExecutableByName - should resolve executable config for valid app", () => {
            const { executable } = standata.getExecutableByName({
                appName: "espresso",
                execName: "pw.x",
            });
            expect(executable).to.be.an("object");
            expect(executable).to.have.property("name", "pw.x");
        });

        it("getExecutableByName - should throw for app without executable tree", () => {
            expect(() => {
                standata.getExecutableByName({ appName: "nonexistent" });
            }).to.throw("nonexistent is not a known application with executable tree");
        });

        it("getAllAppData - should return all application data", () => {
            const allData = standata.getAllAppData();
            expect(allData).to.be.an("array");
            expect(allData.length).to.be.greaterThan(0);
            expect(allData[0]).to.have.property("name");
        });

        it("getTemplatesByName - should return filtered templates", () => {
            const templates = standata.getTemplatesByName("espresso", "pw.x");
            expect(templates).to.be.an("array");
            templates.forEach((template) => {
                expect(template).to.have.property("applicationName", "espresso");
                expect(template).to.have.property("executableName", "pw.x");
            });
        });

        it("getTemplatesByName - should filter by template name when provided", () => {
            const allTemplates = standata.getTemplatesByName("espresso", "pw.x");
            if (allTemplates.length > 0) {
                const templateName = allTemplates[0].name;
                const filtered = standata.getTemplatesByName("espresso", "pw.x", templateName);
                expect(filtered).to.be.an("array");
                filtered.forEach((template) => {
                    expect(template).to.have.property("name", templateName);
                });
            }
        });

        it("getByApplicationName - should return entities by application name", () => {
            const entities = standata.getByApplicationName("espresso");
            expect(entities).to.be.an("array");
            expect(entities.length).to.be.greaterThan(0);
            entities.forEach((entity) => {
                expect(entity).to.have.property("name", "espresso");
            });
        });

        it("returns default config", () => {
            const defaultConfig = standata.getDefaultConfig();
            expect(defaultConfig).to.be.an("object");
            expect(defaultConfig).to.have.property("name", "espresso");
            expect(defaultConfig).to.have.property("shortName", "qe");
            expect(defaultConfig).to.have.property("summary", "Quantum ESPRESSO");
            expect(defaultConfig).to.have.property("version", "6.3");
            expect(defaultConfig).to.have.property("build", "GNU");

            expect(defaultConfig).to.not.have.property("isDefault");
            expect(defaultConfig).to.not.have.property("hasAdvancedComputeOptions");
        });
    });
});
