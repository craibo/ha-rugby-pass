import { describe, expect, it } from "vitest";
import { pickStubEntity, entityChanged } from "../src/editor-helpers";

describe("pickStubEntity", () => {
  it("returns first matching game sensor", () => {
    const states = {
      "sensor.temp": {},
      "sensor.leinster_next_game": {},
      "sensor.leinster_current_game": {},
    };
    expect(pickStubEntity(states)).toBe("sensor.leinster_next_game");
  });
  it("matches previous_game_N", () => {
    expect(pickStubEntity({ "sensor.x_previous_game_2": {} })).toBe("sensor.x_previous_game_2");
  });
  it("returns empty string when none", () => {
    expect(pickStubEntity({ "light.a": {}, "sensor.b": {} })).toBe("");
    expect(pickStubEntity(undefined)).toBe("");
  });
});

describe("entityChanged", () => {
  const a = { state: "x" };
  it("false when same object", () => {
    expect(entityChanged({ "sensor.a": a }, { "sensor.a": a }, "sensor.a")).toBe(false);
  });
  it("true when object replaced", () => {
    expect(entityChanged({ "sensor.a": a }, { "sensor.a": { state: "x" } }, "sensor.a")).toBe(true);
  });
  it("true when no previous hass", () => {
    expect(entityChanged(undefined, { "sensor.a": a }, "sensor.a")).toBe(true);
  });
  it("false for other entities changing", () => {
    expect(entityChanged({ "sensor.a": a, "x.y": {} }, { "sensor.a": a, "x.y": {} }, "sensor.a")).toBe(false);
  });
});
