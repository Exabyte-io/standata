"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TAGS = void 0;
const compare_versions_1 = require("compare-versions");
var TAGS;
(function (TAGS) {
    TAGS["DEFAULT"] = "default";
    TAGS["DEFAULT_VERSION"] = "default_version";
    TAGS["DEFAULT_BUILD"] = "default_build";
})(TAGS || (exports.TAGS = TAGS = {}));
/**
 * Whether `version` matches executable `supportedApplicationVersions`.
 * Delegates to [`compare-versions`](https://www.npmjs.com/package/compare-versions): npm-style ranges work for
 * dot-separated numeric versions (including short semver like `7.5` and CalVer like `2025.07.22.2`).
 */
function applicationVersionSatisfiesSupportedRange(version, rangeSpec) {
    const range = rangeSpec.trim();
    if (range === "*" || range === "") {
        return true;
    }
    if (!(0, compare_versions_1.validate)(version)) {
        return false;
    }
    try {
        return (0, compare_versions_1.satisfies)(version, range);
    }
    catch (_a) {
        return false;
    }
}
class ApplicationRegistry {
    static setDriver(driver) {
        this.driver = driver;
    }
    constructor(driver) {
        this.driver = driver || ApplicationRegistry.driver;
    }
    getApplications() {
        return this.driver.getApplications();
    }
    findApplication({ name, version, build }) {
        const application = this.driver
            .getApplications()
            .filter((application) => {
            return application.name === name;
        })
            .filter((application) => {
            return version ? application.version === version : application.isDefaultVersion;
        })
            .find((application) => {
            return build ? application.build === build : application.isDefault;
        });
        if (!application) {
            throw new Error(`Application ${name} not found`);
        }
        return application;
    }
    getDefaultApplication() {
        return this.driver.getApplications().find((application) => application.isDefault);
    }
    getExecutablesByApplication(application) {
        return this.driver.getExecutables().filter((executable) => {
            return (executable.applicationName === application.name &&
                applicationVersionSatisfiesSupportedRange(application.version, executable.applicationVersion));
        });
    }
    getFlavorsByApplicationExecutable(application, executable) {
        return this.driver.getFlavors().filter((flavor) => {
            return (flavor.applicationName === application.name &&
                applicationVersionSatisfiesSupportedRange(application.version, flavor.applicationVersion) &&
                flavor.executableName === executable.name);
        });
    }
    getTemplatesByName(appName, execName, templateName) {
        return this.driver.getTemplates().filter((template) => {
            return (template.applicationName === appName &&
                template.executableName === execName &&
                template.name === templateName);
        });
    }
    getInput(flavor) {
        const appName = flavor.applicationName;
        const execName = flavor.executableName;
        return flavor.input.map((input) => {
            const inputName = input.templateName || input.name;
            const filtered = this.getTemplatesByName(appName, execName, inputName);
            if (filtered.length !== 1) {
                console.log(`found ${filtered.length} templates for app=${appName} exec=${execName} name=${inputName} expected 1`);
            }
            return { ...filtered[0], name: input.name };
        });
    }
}
exports.default = ApplicationRegistry;
