import { expect } from "chai";

import { MaterialStandata } from "../../src/js";
import Si from "./fixtures/Si.json";

describe("Materials Standata", () => {
    it("can search materials by tags", () => {
        const std = new MaterialStandata();
        const tags = ["3D", "bulk", "semiconductor"];
        const entities = std.find_entities(...tags);
        expect(entities).to.deep.include.members([Si]);
    });
});
