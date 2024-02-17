import { expect } from "chai";

import h_BN from "../../materials/BN-[Hexagonal_Boron_Nitride]-HEX_[P6_3%2Fmmc]_3D_[Bulk]-[mp-984].json";
import Graphene from "../../materials/C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[mp-1040425].json";
import Na4Cl4 from "../../materials/NaCl-[Sodium_Chloride]-CUB_[Fm-3m]_3D_[Bulk]-[mp-22862].json";
import WS2 from "../../materials/WS2_001.json";
import { MaterialStandata } from "../../src/js";
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
