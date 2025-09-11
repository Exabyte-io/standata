import { Standata } from "./base";
import PROPERTIES from "./runtime_data/properties.json";

export class PropertyStandata extends Standata {
    static runtimeData = PROPERTIES;
}

export const properties: PropertyStandata = new PropertyStandata();
