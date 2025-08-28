import { Standata } from "./base";
import WORKFLOWS from "./runtime_data/workflows.json";
import SUBWORKFLOWS from "./runtime_data/subworkflows.json";

export class WorkflowStandata extends Standata {
    static runtimeData = WORKFLOWS;
}

export class SubworkflowStandata extends Standata {
    static runtimeData = SUBWORKFLOWS;
}
