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
        it("getApplicationsTree - merges application version map into nested version/build entries", () => {
            const tree = standata.getApplicationsTree();
            expect(tree).to.be.an("object");
            expect(tree).to.have.property("espresso");
            const { espresso } = tree;
            expect(espresso).to.have.property("defaultVersion", "6.3");
            expect(espresso.versions).to.have.property("6.3");
            expect(espresso.versions["6.3"]).to.have.property("GNU");
            const gnu63 = espresso.versions["6.3"].GNU;
            expect(gnu63).to.have.property("name", "espresso");
            expect(gnu63).to.have.property("shortName", "qe");
        });

        it("getApplications - flattens every version/build from the applications tree", () => {
            const apps = standata.getApplications();
            expect(apps).to.be.an("array");
            expect(apps.length).to.be.greaterThan(0);
            const espressoGnu = apps.find(
                (a) => a.name === "espresso" && a.version === "6.3" && a.build === "GNU",
            );
            expect(espressoGnu).to.not.equal(undefined);
            expect(espressoGnu).to.have.property("shortName", "qe");
        });

        it("getApplicationTreeItem - returns defaultVersion and versions for a known app", () => {
            const item = standata.getApplicationTreeItem("espresso");
            expect(item.defaultVersion).to.equal("6.3");
            expect(item.versions).to.have.key("6.3");
        });

        it("getApplicationTreeItem - should throw for unknown application", () => {
            expect(() => {
                standata.getApplicationTreeItem("nonexistent");
            }).to.throw("Application nonexistent not found");
        });

        it("getApplication - resolves default version and build from application config", () => {
            const app = standata.getApplication({ name: "espresso" });
            expect(app).to.have.property("name", "espresso");
            expect(app).to.have.property("shortName", "qe");
            expect(app).to.have.property("version", "6.3");
            expect(app).to.have.property("build", "GNU");
        });

        it("getExecutableByName - should resolve executable config for valid app", () => {
            const exec = standata.getExecutableByName("espresso", "pw.x");
            expect(exec).to.be.an("object");
            expect(exec).to.have.property("name", "pw.x");
        });

        it("getExecutableByName - should throw for app without executable tree", () => {
            expect(() => {
                standata.getExecutableByName("nonexistent");
            }).to.throw("nonexistent is not a known application with executable tree");
        });

        it("getAllAppData - should return all application data", () => {
            const allData = standata.getAllAppData();
            expect(allData).to.be.an("array");
            expect(allData.length).to.be.greaterThan(0);
            expect(allData[0]).to.have.property("name");
        });

        it("getApplicationsTree - application keys are unique and list known apps", () => {
            const names = Object.keys(standata.getApplicationsTree());
            expect(names).to.be.an("array");
            expect(names).to.include("espresso");
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

        it("returns default version config when no version specified", () => {
            const defaultVersionConfig = standata.getDefaultConfigByNameAndVersion("espresso");
            expect(defaultVersionConfig).to.be.an("object");
            expect(defaultVersionConfig).to.have.property("name", "espresso");
            expect(defaultVersionConfig).to.have.property("version", "6.3");
        });

        it("returns default build config when version specified", () => {
            const defaultBuildConfig = standata.getDefaultConfigByNameAndVersion("espresso", "6.3");
            expect(defaultBuildConfig).to.be.an("object");
            expect(defaultBuildConfig).to.have.property("name", "espresso");
            expect(defaultBuildConfig).to.have.property("version", "6.3");
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
