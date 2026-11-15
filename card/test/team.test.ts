import { describe, expect, it } from "vitest";
import {
  buildTeamView,
  deriveTeamEntities,
  validateTeamConfig,
  teamEntityIds,
} from "../src/team";
import { entitiesChanged } from "../src/editor-helpers";
import type { HassEntity } from "../src/state";

describe("deriveTeamEntities", () => {
  const expected = (p: string) => ({
    current: `${p}_current_game`,
    next: `${p}_next_game`,
    previous: [1, 2, 3, 4, 5].map((n) => `${p}_previous_game_${n}`),
  });
  it("derives from each suffix", () => {
    for (const s of ["_current_game", "_next_game", "_previous_game_1", "_previous_game_5"]) {
      expect(deriveTeamEntities(`sensor.leinster${s}`)).toEqual(expected("sensor.leinster"));
    }
  });
  it("keeps previous order", () => {
    expect(deriveTeamEntities("sensor.a_next_game")?.previous[0]).toBe("sensor.a_previous_game_1");
    expect(deriveTeamEntities("sensor.a_next_game")?.previous[4]).toBe("sensor.a_previous_game_5");
  });
  it("returns undefined for non-matching", () => {
    expect(deriveTeamEntities("sensor.leinster")).toBeUndefined();
    expect(deriveTeamEntities("sensor.a_previous_game_6")).toBeUndefined();
    expect(deriveTeamEntities("sensor.a_previous_game_0")).toBeUndefined();
    expect(deriveTeamEntities("sensor.a_next_game_x")).toBeUndefined();
  });
});

const base = {
  opposition: "Wallabies",
  home_away: "home",
  kickoff: "2026-11-21T09:00:00+00:00",
  venue: "Murrayfield",
  home_team: "Scotland",
  away_team: "Wallabies",
  home_score: null,
  away_score: null,
  period: "Kick off",
  minute: null,
  status: "upcoming",
  match_url: "x",
  logos: {},
};
const ent = (state: string, over: Record<string, unknown> = {}): HassEntity => ({
  state,
  attributes: { ...base, ...over },
});
const live = ent("Second Half", { period: "Second Half", minute: 60, home_score: 3, away_score: 0 });
const none: HassEntity = { state: "No game in progress", attributes: {} };
const next = ent("2026-11-21T09:00:00+00:00");
const prev = (state: string, over: Record<string, unknown> = {}) => ent(state, { period: "Result", ...over });

const cfg = {
  current: "c",
  next: "n",
  previous: ["p1", "p2", "p3", "p4", "p5"],
};

describe("buildTeamView top", () => {
  it("prefers live current", () => {
    const v = buildTeamView({ c: live, n: next }, cfg, "en", "UTC");
    expect(v.top.mode).toBe("live");
  });
  it("falls back to next", () => {
    const v = buildTeamView({ c: none, n: next }, cfg, "en", "UTC");
    expect(v.top.mode).toBe("upcoming");
  });
  it("empty when neither", () => {
    const v = buildTeamView({ c: none, n: { state: "unknown", attributes: {} } }, cfg, "en", "UTC");
    expect(v.top.mode).toBe("empty");
    expect(buildTeamView({}, cfg, "en", "UTC").top.headline).toBe("No game");
  });
  it("heading from title", () => {
    expect(buildTeamView({}, { ...cfg, title: "Leinster" }, "en", "UTC").heading).toBe("Leinster");
    expect(buildTeamView({}, cfg, "en", "UTC").heading).toBeUndefined();
  });
});

describe("buildTeamView previous", () => {
  it("skips unknown slots and preserves order", () => {
    const states = {
      p1: prev("W 24–17", { opposition: "Munster" }),
      p2: { state: "unknown", attributes: {} },
      p3: prev("L 5–50", { opposition: "Ulster", home_away: "away" }),
      p4: { state: "unavailable", attributes: { opposition: "X" } },
    };
    const v = buildTeamView(states, cfg, "en", "UTC");
    expect(v.previous.map((r) => r.opposition)).toEqual(["Munster", "Ulster"]);
    expect(v.previous[0]).toMatchObject({ score: "W 24–17", outcome: "win", venue: "home" });
    expect(v.previous[1]).toMatchObject({ score: "L 5–50", outcome: "loss", venue: "away" });
  });
  it("parses draw and unavailable result", () => {
    const v = buildTeamView(
      { p1: prev("D 10–10"), p2: prev("Result unavailable") },
      cfg,
      "en",
      "UTC",
    );
    expect(v.previous[0].outcome).toBe("draw");
    expect(v.previous[1]).toMatchObject({ outcome: "unknown", score: "Result unavailable" });
  });
  it("formats date with timezone", () => {
    const k = { kickoff: "2026-11-21T23:30:00+00:00" };
    const utc = buildTeamView({ p1: prev("W 1–0", k) }, cfg, "en-GB", "UTC").previous[0].date;
    const syd = buildTeamView({ p1: prev("W 1–0", k) }, cfg, "en-GB", "Australia/Sydney").previous[0].date;
    expect(utc).toContain("21");
    expect(syd).toContain("22");
  });
  it("does not throw on bad data", () => {
    const states = {
      p1: prev("W 1–0", { kickoff: "garbage" }),
      p2: prev("W 1–0", { kickoff: 5, opposition: "A" }),
      p3: prev("W 1–0", { home_away: 7, opposition: "B" }),
      p4: { state: "W 1–0", attributes: "nope" as unknown as Record<string, unknown> },
      p5: prev("W 1–0", { opposition: 3 }),
    };
    const v = buildTeamView(states, cfg, "en", "UTC");
    expect(v.previous.length).toBe(3);
    expect(v.previous[0].date).toBe("garbage");
    expect(v.previous[1].date).toBe("–");
    expect(() => buildTeamView(states, cfg, "en", "Not/AZone")).not.toThrow();
    expect(buildTeamView(states, cfg, "en", "Not/AZone").previous[0].date).toBe("garbage");
    expect(buildTeamView({ p1: prev("W 1–0") }, cfg, "en", "Not/AZone").previous[0].date).toBe(
      "2026-11-21T09:00:00+00:00",
    );
  });
  it("handles missing previous config", () => {
    expect(buildTeamView({}, { next: "n" }, "en", "UTC").previous).toEqual([]);
  });
});

describe("validateTeamConfig", () => {
  it("errors when nothing configured", () => {
    expect(() => validateTeamConfig({} as never)).toThrow(/rugbypass-team-card/);
    expect(() => validateTeamConfig({ previous: [] } as never)).toThrow();
    expect(() => validateTeamConfig(undefined as never)).toThrow();
    expect(() => validateTeamConfig({ next: "" } as never)).toThrow();
  });
  it("accepts next, current or previous", () => {
    expect(validateTeamConfig({ next: "a" }).next).toBe("a");
    expect(validateTeamConfig({ current: "a" }).current).toBe("a");
    expect(validateTeamConfig({ previous: ["a"] }).previous).toEqual(["a"]);
  });
  it("trims previous to 5 without mutating", () => {
    const input = { previous: ["1", "2", "3", "4", "5", "6", "7"] };
    const out = validateTeamConfig(input);
    expect(out.previous).toHaveLength(5);
    expect(input.previous).toHaveLength(7);
  });
  it("teamEntityIds lists all configured", () => {
    expect(teamEntityIds({ current: "c", next: "n", previous: ["a", "b"] })).toEqual(["c", "n", "a", "b"]);
    expect(teamEntityIds({ next: "n" })).toEqual(["n"]);
  });
});

describe("entitiesChanged", () => {
  const a = { state: "1" };
  const b = { state: "2" };
  it("false when watched unchanged", () => {
    expect(entitiesChanged({ x: a, y: b, z: {} }, { x: a, y: b, z: {} }, ["x", "y"])).toBe(false);
  });
  it("true when any watched changed", () => {
    expect(entitiesChanged({ x: a, y: b }, { x: a, y: { state: "2" } }, ["x", "y"])).toBe(true);
  });
  it("true with no prev hass", () => {
    expect(entitiesChanged(undefined, { x: a }, ["x"])).toBe(true);
  });
});
