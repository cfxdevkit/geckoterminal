import { describe, expect, it } from "@jest/globals";
import { GeckoTerminal, GeckoTerminalAPI } from "../../core";

describe("Core exports", () => {
  it("should export GeckoTerminal class", () => {
    expect(GeckoTerminal).toBeDefined();
    expect(new GeckoTerminal()).toBeInstanceOf(GeckoTerminal);
  });

  it("should export GeckoTerminalAPI class", () => {
    expect(GeckoTerminalAPI).toBeDefined();
    expect(new GeckoTerminalAPI()).toBeInstanceOf(GeckoTerminalAPI);
  });

  it("should have GeckoTerminal extend GeckoTerminalAPI", () => {
    expect(new GeckoTerminal()).toBeInstanceOf(GeckoTerminalAPI);
  });
});
