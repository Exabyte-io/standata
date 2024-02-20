import { expect } from "chai";

import h_BN from "../../materials/BN-[Hexagonal_Boron_Nitride]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-4991].json";
import Graphene from "../../materials/C-[Graphene]-HEX_[P6%2Fmmm]_2D_[Monolayer]-[2dm-3993].json";
import Na4Cl4 from "../../materials/NaCl-[Sodium_Chloride]-FCC_[Fm-3m]_3D_[Bulk]-[mp-22862].json";
import Si from "../../materials/Si-[Silicon]-FCC_[Fd-3m]_3D_[Bulk]-[mp-149].json";
import WS2 from "../../materials/WS2-[Tungsten_Disulfide]-HEX_[P-6m2]_2D_[Monolayer]-[2dm-3749].json";
import { MaterialStandata } from "../../src/js";

const TOTAL_NUMBER_OF_MATERIALS = 28;

describe("Materials Standata", () => {
    it("can return the list of all materials", () => {
        const materialConfigs = MaterialStandata.getRuntimeDataConfigs();
        expect(materialConfigs.length).to.be.equal(TOTAL_NUMBER_OF_MATERIALS);
    });

    it("can search materials by tags", () => {
        const std = new MaterialStandata();
        const tags = ["3D", "bulk", "semiconductor"];
        const entities = std.findEntitiesByTags(...tags);
        expect(entities).to.deep.include.members([Si]);
        expect(entities.length).to.be.lessThan(std.entities.length);
    });

    it("should return all entities with the same tag", () => {
        const std = new MaterialStandata();
        const tags = ["2D"];
        const entities = std.findEntitiesByTags(...tags);
        expect(entities).to.deep.include.members([Graphene, h_BN, WS2]);
        expect(entities).to.not.deep.include.members([Si, Na4Cl4]);
        expect(entities.length).to.be.lessThan(std.entities.length);
    });
});
