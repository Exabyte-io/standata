import { Standata } from "./base";
import SUBWORKFLOWS from "./runtime_data/subworkflows.json";
import WORKFLOWS from "./runtime_data/workflows.json";

export class WorkflowStandata extends Standata {
    static runtimeData = WORKFLOWS;

    findByApplication(appName: string) {
        return this.findEntitiesByTags(appName);
    }

    findByApplicationAndName(appName: string, displayName: string) {
        return this.findByApplication(appName).find((w: any) => w?.name === displayName);
    }

    getRelaxationWorkflowByApplication(appName: string) {
        const workflows = this.findEntitiesByTags("relaxation", appName);
        if (workflows.length === 0) {
            return undefined;
        }
        return workflows[0];
    }

    getDefault() {
        const defaults = this.findEntitiesByTags("default");
        if (defaults.length === 0) {
            console.error("No default workflow found!");
            return undefined;
        }
        if (defaults.length > 1) {
            console.error("More than one default workflow found!");
            return defaults[0];
        }
        return defaults[0];
    }
}

export class SubworkflowStandata extends Standata {
    static runtimeData = SUBWORKFLOWS;
}
