import { expect } from "chai";

import { WorkflowStandata } from "../../src/js";

describe("Workflow Standata", () => {
    it("can search workflows by tags", () => {
        const std = new WorkflowStandata();
        const tags = ["espresso", "single-material", "total_energy"];
        const entities = std.findEntitiesByTags(...tags);

        // Check that we found some entities
        expect(entities.length).to.be.greaterThan(0);
        expect(entities.length).to.be.lessThanOrEqual(std.entities.length);

        // Check that all found entities are espresso workflows with total_energy property
        entities.forEach((entity: any) => {
            // Check that it's an espresso workflow
            expect(entity.subworkflows).to.be.an("array");
            expect(entity.subworkflows[0].application.name).to.equal("espresso");

            // Check that it has total_energy property
            expect(entity.properties).to.be.an("array");
            expect(entity.properties).to.include("total_energy");
        });
    });
});
