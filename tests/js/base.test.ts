import { expect } from "chai";

import { Standata } from "../../src/js/base";

describe("Standata base class", () => {
    const CATEGORIES_CONFIG = {
        categories: {
            type: ["A", "BA", "C"],
            subtype: ["1", "2", "3", "4"],
            other: ["A"],
        },
        entities: [
            { filename: "entity_1.json", categories: ["A", "1", "C"] },
            { filename: "entity_2.json", categories: ["C", "2", "BA", "4"] },
        ],
    };

    it("can be instantiated", () => {
        const std = new Standata(CATEGORIES_CONFIG);
        expect(std.entities).to.have.length(2);
        expect(std.categories.length).to.be.greaterThan(0);
    });

    it("flattens the categories map", () => {
        const std = new Standata(CATEGORIES_CONFIG);
        const expected = [
            "type/A",
            "type/BA",
            "type/C",
            "subtype/1",
            "subtype/2",
            "subtype/3",
            "subtype/4",
            "other/A",
        ];
        expect(std.categories).to.have.members(expected);
    });

    it("converts tags to unique category strings", () => {
        const std = new Standata(CATEGORIES_CONFIG);
        const tags = ["A", "AB", "BA", "CC"];
        const categories = std.convertTagToCategory(...tags);
        const expected = ["type/A", "other/A", "type/BA"];
        expect(categories).to.have.members(expected);
    });
});
