import { Standata } from "./base";
import MATERIALS from "./entities/materials.json";

export class MaterialStandata extends Standata {
    constructor() {
        super(MATERIALS);
    }

    // eslint-disable-next-line class-methods-use-this
    protected loadEntity(filename: string): object | undefined {
        return MATERIALS[filename];
    }
}
