import { Standata } from "./base";
import PROPERTIES from "./entities/properties.json";

export class PropertyStandata extends Standata {
    constructor() {
        super(PROPERTIES);
    }

    // eslint-disable-next-line class-methods-use-this
    protected loadEntity(filename: string): object | undefined {
        return PROPERTIES[filename];
    }
}
