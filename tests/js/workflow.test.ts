import { expect } from "chai";

import { WorkflowStandata } from "../../src/js";
import TotalEnergyWorkflow from "./fixtures/total_energy.json";

describe("Workflow Standata", () => {
    it("can search workflows by tags", () => {
        const std = new WorkflowStandata();
        const tags = ["espresso", "single-material", "total_energy"];
        const entities = std.findEntitiesByTags(...tags);
        expect(entities).to.deep.include.members([TotalEnergyWorkflow]);
        expect(entities.length).to.be.lessThan(std.entities.length);
    });
});
