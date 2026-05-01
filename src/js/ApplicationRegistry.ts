/* eslint-disable class-methods-use-this */
import type {
    ApplicationSchema,
    ExecutableSchema,
    FlavorSchema,
    TemplateSchema,
} from "@mat3ra/esse/dist/js/types";

import { applicationVersionSatisfiesSupportedRange } from "./utils/applicationVersion";

export enum TAGS {
    DEFAULT = "default",
    DEFAULT_VERSION = "default_version",
    DEFAULT_BUILD = "default_build",
}

export interface ApplicationDriver {
    getApplications(): ApplicationSchema[];
    getTemplates(): TemplateSchema[];
    getFlavors(): FlavorSchema[];
    getExecutables(): ExecutableSchema[];
}

export default class ApplicationRegistry {
    static driver: ApplicationDriver;

    private driver: ApplicationDriver;

    static setDriver(driver: ApplicationDriver) {
        this.driver = driver;
    }

    constructor(driver?: ApplicationDriver) {
        this.driver = driver || ApplicationRegistry.driver;
    }

    getApplications() {
        return this.driver.getApplications();
    }

    getTemplates() {
        return this.driver.getTemplates();
    }

    getFlavors() {
        return this.driver.getFlavors();
    }

    getExecutables() {
        return this.driver.getExecutables();
    }

    findApplication({ name, version, build }: { name: string; version?: string; build?: string }) {
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

    getExecutablesByApplication(application: Pick<ApplicationSchema, "name" | "version">) {
        return this.driver.getExecutables().filter((executable) => {
            return (
                executable.applicationName === application.name &&
                applicationVersionSatisfiesSupportedRange(
                    application.version,
                    executable.applicationVersion,
                )
            );
        });
    }

    getFlavorsByApplicationExecutable(
        application: Pick<ApplicationSchema, "name" | "version">,
        executable: Pick<ExecutableSchema, "name">,
    ) {
        return this.driver.getFlavors().filter((flavor) => {
            return (
                flavor.applicationName === application.name &&
                applicationVersionSatisfiesSupportedRange(
                    application.version,
                    flavor.applicationVersion,
                ) &&
                flavor.executableName === executable.name
            );
        });
    }

    getTemplatesByName(appName: string, execName: string, templateName: string): TemplateSchema[] {
        return this.driver.getTemplates().filter((template) => {
            return (
                template.applicationName === appName &&
                template.executableName === execName &&
                template.name === templateName
            );
        });
    }

    getInput(flavor: FlavorSchema): TemplateSchema[] {
        const appName = flavor.applicationName;
        const execName = flavor.executableName;

        return flavor.input.map((input): TemplateSchema => {
            const inputName = input.templateName || input.name;
            const filtered = this.getTemplatesByName(appName, execName, inputName);

            if (filtered.length !== 1) {
                console.log(
                    `found ${filtered.length} templates for app=${appName} exec=${execName} name=${inputName} expected 1`,
                );
            }

            return { ...filtered[0], name: input.name };
        });
    }
}
