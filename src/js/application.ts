import { Standata } from "./base";
import APPLICATIONS from "./runtime_data/applications.json";

export class ApplicationStandata extends Standata {
    static runtimeData = APPLICATIONS;
}
