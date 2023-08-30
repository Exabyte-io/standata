import { Standata } from "./base";
import WORKFLOWS from "./runtime_data/workflows.json";

export class WorkflowStandata extends Standata {
    static runtimeData = WORKFLOWS;
}
