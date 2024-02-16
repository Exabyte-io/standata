import { expect } from "chai";

import WS2 from "../../materials/WS2_001.json";
import { MaterialStandata } from "../../src/js";
import Graphene from "./fixtures/Graphene.json";
import h_BN from "./fixtures/h-BN.json";
import Na4Cl4 from "./fixtures/Na4Cl4.json";
import Si from "./fixtures/Si.json";

describe("Materials Standata", () => {
    it("can search materials by tags", () => {
        const std = new MaterialStandata();
        const tags = ["3D", "bulk", "semiconductor"];
        const entities = std.find_entities(...tags);
        expect(entities).to.deep.include.members([Si]);
        expect(entities.length).to.be.lessThan(std.entities.length);
    });

    it("should return all entities with the same tag", () => {
        const std = new MaterialStandata();
        const tags = ["2D"];
        const entities = std.find_entities(...tags);
        expect(entities).to.deep.include.members([Graphene, h_BN, WS2]);
        expect(entities).to.not.deep.include.members([Si, Na4Cl4]);
        expect(entities.length).to.be.lessThan(std.entities.length);
    });
});
