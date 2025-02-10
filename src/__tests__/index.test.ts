import { describe, expect, it } from "@jest/globals";
import { GeckoTerminal } from "../index";

describe("Package exports", () => {
  it("should export GeckoTerminal class", () => {
    expect(GeckoTerminal).toBeDefined();
    expect(new GeckoTerminal()).toBeInstanceOf(GeckoTerminal);
  });
});
