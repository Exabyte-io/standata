import { expect } from "chai";

import { MaterialStandata } from "../../src/js";
import Si from "./fixtures/Si.json";
import Na4Cl4 from "./fixtures/Na4Cl4.json";
import Graphene from "./fixtures/C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-3993].json";
import h_BN from "./fixtures/BN-[Boron_Nitride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-7991].json";
import WS2 from "./fixtures/WS2.json";

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
