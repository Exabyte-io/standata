import type { ApplicationSchema, ExecutableSchema, FlavorSchema, TemplateSchema } from "@mat3ra/esse/dist/js/types";
import type { ApplicationDriver } from "./application";
export default class StandataDriver implements ApplicationDriver {
    private applications;
    private templates;
    private flavors;
    private executables;
    getApplications(): ApplicationSchema[];
    getTemplates(): TemplateSchema[];
    getFlavors(): FlavorSchema[];
    getExecutables(): ExecutableSchema[];
}
