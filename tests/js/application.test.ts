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
});
