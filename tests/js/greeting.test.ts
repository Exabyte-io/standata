import { expect } from "chai";

import { greet } from "../../src/js";

describe("example test", () => {
    it("should pass", () => {
        const greeting = greet("there");
        expect(greeting).to.be.eql("Hello there!");
    });
});
