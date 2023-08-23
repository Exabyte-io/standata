import { Standata } from "./base";
import APPLICATIONS from "./entities/applications.json";

export class ApplicationStandata extends Standata {
    constructor() {
        super(APPLICATIONS);
    }

    // eslint-disable-next-line class-methods-use-this
    protected loadEntity(filename: string): object | undefined {
        return APPLICATIONS[filename];
    }
}
