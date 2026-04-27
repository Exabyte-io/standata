import type {
    ApplicationSchema,
    ExecutableSchema,
    ExecutionUnitSchema,
    FlavorSchema,
} from "@mat3ra/esse/dist/js/types";

import { ApplicationStandata } from "../../../../src/js/application";
import { UnitConfigBuilder } from "./UnitConfigBuilder";

export type ExecutionConfig = {
    name: string;
    execName?: string;
    flavorName?: string;
    flowchartId?: string;
};

export default class ExecutionUnitConfigBuilder extends UnitConfigBuilder<"execution"> {
    private application: ApplicationSchema;

    private executable: ExecutableSchema;

    private flavor: FlavorSchema;

    constructor(config: ExecutionConfig, application: ApplicationSchema, cache?: string[]) {
        super({ name: config.name, type: "execution", flowchartId: config.flowchartId, cache });

        const { executable, flavor } = new ApplicationStandata().getExecutableAndFlavorByName({
            appName: application.name,
            appVersion: application.version,
            execName: config.execName,
            flavorName: config.flavorName,
        });

        this.application = application;
        this.executable = executable;
        this.flavor = flavor;

        this._results = this.flavor.results;
        this._monitors = this.flavor.monitors;
        this._preProcessors = this.flavor.preProcessors;
        this._postProcessors = this.flavor.postProcessors;
    }

    applyFunctions(functions: Record<string, unknown> = {}) {
        Object.entries(functions).forEach(([funcName, args]) => {
            if (this[funcName]) {
                if (args) {
                    this[funcName](args);
                } else {
                    this[funcName]();
                }
            }
        });
        return this;
    }

    build(attributes: Record<string, unknown> = {}): ExecutionUnitSchema {
        return {
            ...super.build(),
            application: this.application,
            executable: this.executable,
            flavor: this.flavor,
            input: new ApplicationStandata().getInput(this.flavor).map((input) => ({
                template: input,
                rendered: "",
                isManuallyChanged: false,
            })),
            context: {},
            ...attributes,
        };
    }
}
