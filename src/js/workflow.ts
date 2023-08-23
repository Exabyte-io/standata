import { Standata } from "./base";
import WORKFLOWS from "./entities/workflows.json";

export class WorkflowStandata extends Standata {
    constructor() {
        super(WORKFLOWS);
    }

    // eslint-disable-next-line class-methods-use-this
    protected loadEntity(filename: string): object | undefined {
        return WORKFLOWS[filename];
    }
}
