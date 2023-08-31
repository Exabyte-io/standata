import { Standata } from "./base";
import MATERIALS from "./runtime_data/materials.json";

export class MaterialStandata extends Standata {
    static runtimeData = MATERIALS;
}
