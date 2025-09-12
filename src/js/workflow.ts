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
}

export class SubworkflowStandata extends Standata {
    static runtimeData = SUBWORKFLOWS;
}
