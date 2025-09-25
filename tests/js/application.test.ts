import { expect } from "chai";

import { ApplicationStandata } from "../../src/js";
import Python386 from "./fixtures/python_386.json";

describe("Application Standata", () => {
    it("can search applications by tags", () => {
        const std = new ApplicationStandata();
        const tags = ["scripting", "programming_language"];
        const entities = std.findEntitiesByTags(...tags);
        expect(entities).to.deep.include.members([Python386]);
        expect(entities.length).to.be.lessThan(std.entities.length);
    });

    it("can find espresso applications", () => {
        const std = new ApplicationStandata();
        const espressoApps = std.findEntitiesByTags("quantum-mechanical");
        expect(espressoApps).to.be.an("array");
        expect(espressoApps.length).to.be.greaterThan(0);
        expect(espressoApps[0]).to.have.property("name", "espresso");
    });
});
