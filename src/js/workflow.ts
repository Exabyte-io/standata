import { Standata } from "./base";
import WORKFLOWS from "./runtime_data/workflows.json";
import SUBWORKFLOWS from "./runtime_data/subworkflows.json";

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

export const workflows = {
    get_all: () => new WorkflowStandata().getAll(),
    get_by_application: (appName: string) => {
        const sd = new WorkflowStandata();
        const list = sd.findByApplication(appName);
        return {
            get_all: () => list,
            get_by_name: (displayName: string) =>
                list.find((w: any) => w?.name === displayName),
        };
    },
};
