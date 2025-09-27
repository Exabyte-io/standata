import { expect } from "chai";

import { ApplicationStandata } from "../../src/js";
import EspressoGnu63 from "./fixtures/espresso_gnu_63.json";

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
        it("getAppDataForApplication - should return application data for valid app", () => {
            const appData = standata.getAppDataForApplication("espresso");
            expect(appData).to.be.an("object");
            expect(appData).to.have.property("name", "espresso");
            expect(appData).to.have.property("shortName", "qe");
        });

        it("getAppDataForApplication - should return application config with default version", () => {
            const appData = standata.getAppDataForApplication("espresso");
            expect(appData).to.have.property("defaultVersion", "6.3");
            expect(appData).to.have.property("versions").that.is.an("array");
            expect(appData.versions).to.have.length.greaterThan(0);

            const defaultVersionConfig = appData.versions.find(v => v.isDefault);
            expect(defaultVersionConfig).to.exist;
            expect(defaultVersionConfig).to.have.property("version", appData.defaultVersion);
            expect(defaultVersionConfig).to.have.property("build", "GNU");
            expect(defaultVersionConfig).to.have.property("hasAdvancedComputeOptions", true);
        });

        it("getAppDataForApplication - should throw error for invalid app", () => {
            expect(() => {
                standata.getAppDataForApplication("nonexistent");
            }).to.throw("Application nonexistent not found");
        });

        it("getAppTreeForApplication - should return tree data for valid app", () => {
            const treeData = standata.getAppTreeForApplication("espresso");
            expect(treeData).to.be.an("object");
            expect(treeData).to.have.property("pw.x");
        });

        it("getAppTreeForApplication - should throw error for invalid app", () => {
            expect(() => {
                standata.getAppTreeForApplication("nonexistent");
            }).to.throw("nonexistent is not a known application with executable tree");
        });

        it("getAllAppData - should return all application data", () => {
            const allData = standata.getAllAppData();
            expect(allData).to.be.an("array");
            expect(allData.length).to.be.greaterThan(0);
            expect(allData[0]).to.have.property("name");
        });

        it("getAllApplicationNames - should return unique application names", () => {
            const names = standata.getAllApplicationNames();
            expect(names).to.be.an("array");
            expect(names).to.include("espresso");
            // expect(names).to.include("python");
            // Should be unique
            expect(new Set(names).size).to.equal(names.length);
        });

        it("getAllAppTemplates - should return all templates", () => {
            const templates = standata.getAllAppTemplates();
            expect(templates).to.be.an("array");
            expect(templates.length).to.be.greaterThan(0);
            expect(templates[0]).to.have.property("applicationName");
            expect(templates[0]).to.have.property("name");
        });

        it("getAllAppTree - should return complete tree data", () => {
            const tree = standata.getAllAppTree();
            expect(tree).to.be.an("object");
            expect(tree).to.have.property("espresso");
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
    });
});
