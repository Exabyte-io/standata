import { Standata } from "./base";
import SUBWORKFLOWS from "./runtime_data/subworkflows.json";
import WORKFLOWS from "./runtime_data/workflows.json";
import workflowSubforkflowMapByApplication from "./runtime_data/workflowSubforkflowMapByApplication.json";

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
        return defaults[0];
    }
}

export class SubworkflowStandata extends Standata {
    static runtimeData = SUBWORKFLOWS;
}

export { workflowSubforkflowMapByApplication };
