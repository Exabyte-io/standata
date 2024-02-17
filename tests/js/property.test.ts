import { expect } from "chai";

import { PropertyStandata } from "../../src/js";
import BandStructure from "./fixtures/band_structure.json";

describe("Property Standata", () => {
    it("can search properties by tags", () => {
        const std = new PropertyStandata();
        const tags = ["matrix", "electronic"];
        const entities = std.findEntitiesByTags(...tags);
        expect(entities).to.deep.include.members([BandStructure]);
        expect(entities.length).to.be.lessThan(std.entities.length);
    });
});
