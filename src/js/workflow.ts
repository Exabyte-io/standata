import { Standata } from "./base";
import SUBWORKFLOWS from "./runtime_data/subworkflows.json";
import WORKFLOWS from "./runtime_data/workflows.json";

export class WorkflowStandata extends Standata {
    static runtimeData = WORKFLOWS;

    getAll() {
        return this.entities
            .map((e) => this.loadEntity(e.filename))
            .filter((e): e is object => e !== undefined);
    }

    findByApplication(appName: string) {
        return this.findEntitiesByTags(appName);
    }

    findByApplicationAndName(appName: string, displayName: string) {
        return this.findByApplication(appName).find((w: any) => w?.name === displayName);
    }

    findRelaxationWorkflowByApplicationName(appName: string) {
        return this.findEntitiesByTags("relaxation", appName)[0];
    }

    findDefault() {
        const defaults = this.findEntitiesByTags("default");
        if (defaults.length > 1) {
            console.warn("More than one default workflow found!");
        }
        return defaults[0];
    }
}

export class SubworkflowStandata extends Standata {
    static runtimeData = SUBWORKFLOWS;
}
