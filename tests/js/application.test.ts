import type { FlavorSchema, TemplateSchema } from "@mat3ra/esse/dist/js/types";
import { expect } from "chai";

import { type ApplicationDriver, ApplicationStandata } from "../../src/js/application";
import StandataDriver from "../../src/js/StandataDriver";

describe("ApplicationStandata", () => {
    describe("with runtime ApplicationDriver", () => {
        const driver = new StandataDriver();
        let standata: ApplicationStandata;

        beforeEach(() => {
            standata = new ApplicationStandata(driver);
        });

        it("getDefaultApplication returns the first application flagged isDefault in driver order", () => {
            const apps = driver.getApplications();
            const expected = apps.find((a) => a.isDefault);
            expect(standata.getDefaultApplication()).to.deep.equal(expected);
            expect(expected).to.exist;
        });

        it("getExecutablesByApplication filters by application name and satisfies applicationVersion range", () => {
            const espresso63 = { name: "espresso" as const, version: "6.3" };
            const executables = standata.getExecutablesByApplication(espresso63);
            expect(executables.some((e) => e.name === "pw.x")).to.equal(true);
            const hp = executables.find((e) => e.name === "hp.x");
            expect(hp, "hp.x requires >=7.0 and should not match espresso 6.3").to.equal(undefined);
        });

        it("getExecutablesByApplication includes version-constrained executables when application version matches", () => {
            const espresso75 = { name: "espresso" as const, version: "7.5" };
            const executables = standata.getExecutablesByApplication(espresso75);
            expect(executables.some((e) => e.name === "hp.x")).to.equal(true);
        });

        it("getFlavorsByApplicationExecutable filters by app, version range, and executable name", () => {
            const espresso63 = { name: "espresso" as const, version: "6.3" };
            const flavors63 = standata.getFlavorsByApplicationExecutable(espresso63, {
                name: "pw.x",
            });
            expect(flavors63.some((f) => f.name === "pw_scf")).to.equal(true);
            expect(flavors63.some((f) => f.name === "pw_scf_dft_u")).to.equal(false);

            const espresso75 = { name: "espresso" as const, version: "7.5" };
            const flavors75 = standata.getFlavorsByApplicationExecutable(espresso75, {
                name: "pw.x",
            });
            expect(flavors75.some((f) => f.name === "pw_scf_dft_u")).to.equal(true);
        });

        it("getTemplatesByName returns templates matching application, executable, and template file name", () => {
            const templates = standata.getTemplatesByName("espresso", "pw.x", "pw_scf.in");
            expect(templates.length).to.equal(1);
            const [template] = templates;
            expect(template.applicationName).to.equal("espresso");
            expect(template.executableName).to.equal("pw.x");
            expect(template.name).to.equal("pw_scf.in");
        });

        it("getTemplatesByName returns an empty array when nothing matches", () => {
            expect(
                standata.getTemplatesByName("espresso", "pw.x", "__no_such_template__.in"),
            ).to.deep.equal([]);
        });
    });

    describe("driver wiring", () => {
        let previousDriver: ApplicationDriver | undefined;

        beforeEach(() => {
            previousDriver = ApplicationStandata.driver;
        });

        afterEach(() => {
            ApplicationStandata.driver = previousDriver!;
        });

        it("constructor uses ApplicationStandata.driver when no instance driver is passed", () => {
            const mockDriver: ApplicationDriver = {
                getApplications: () => [{ name: "a", version: "1", isDefault: true } as never],
                getTemplates: () => [],
                getFlavors: () => [],
                getExecutables: () => [],
            };
            ApplicationStandata.setDriver(mockDriver);
            const standata = new ApplicationStandata();
            expect(standata.getDefaultApplication()?.name).to.equal("a");
        });

        it("constructor prefers an explicitly passed driver over ApplicationStandata.driver", () => {
            const unused: ApplicationDriver = {
                getApplications: () => [],
                getTemplates: () => [],
                getFlavors: () => [],
                getExecutables: () => [],
            };
            ApplicationStandata.setDriver(unused);

            const injected: ApplicationDriver = {
                getApplications: () => [
                    { name: "injected", version: "1", isDefault: true } as never,
                ],
                getTemplates: () => [],
                getFlavors: () => [],
                getExecutables: () => [],
            };
            const standata = new ApplicationStandata(injected);
            expect(standata.getDefaultApplication()?.name).to.equal("injected");
        });
    });

    describe("getInput", () => {
        it("resolves flavor input entries via templateName and overlays input name", () => {
            const baseTemplate = {
                applicationName: "test-app",
                executableName: "test-exe",
                name: "base.tpl",
                content: "{}",
            } as TemplateSchema;

            const flavor = {
                applicationName: "test-app",
                executableName: "test-exe",
                input: [{ name: "rendered.in", templateName: "base.tpl" }],
            } as FlavorSchema;

            const mockDriver: ApplicationDriver = {
                getApplications: () => [],
                getTemplates: () => [baseTemplate],
                getFlavors: () => [],
                getExecutables: () => [],
            };

            const standata = new ApplicationStandata(mockDriver);
            const resolved = standata.getInput(flavor);

            expect(resolved).to.have.length(1);
            expect(resolved[0].name).to.equal("rendered.in");
            expect(resolved[0].applicationName).to.equal("test-app");
            expect(resolved[0].executableName).to.equal("test-exe");
            expect(resolved[0].content).to.equal("{}");
        });
    });
});
