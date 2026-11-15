import { describe, expect, it } from "vitest";
import { buildView, type HassEntity } from "../src/state";

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
  match_url: "https://www.rugbypass.com/live/x/",
  logos: { home: "https://l/sco.png", away: "https://l/aus.png" },
};
const ent = (over: Record<string, unknown> = {}, state = "x"): HassEntity => ({
  state,
  attributes: { ...base, ...over },
});

describe("buildView", () => {
  it("upcoming formats kickoff in the given timezone", () => {
    const utc = buildView(ent(), "en-GB", "UTC");
    const syd = buildView(ent(), "en-GB", "Australia/Sydney");
    expect(utc.mode).toBe("upcoming");
    expect(utc.headline).toContain("09:00");
    expect(syd.headline).toContain("20:00");
    expect(syd.headline).not.toBe(utc.headline);
    expect(utc.badge).toBeUndefined();
  });

  it("live shows score and period badge", () => {
    const v = buildView(
      ent({ period: "Second Half", minute: 63, home_score: 12, away_score: 10 }),
      "en",
      "UTC",
    );
    expect(v.mode).toBe("live");
    expect(v.headline).toBe("12 – 10");
    expect(v.badge).toBe("Second Half 63'");
    expect(v.home.score).toBe(12);
    expect(v.away.score).toBe(10);
  });

  it("final shows score and Full time", () => {
    const v = buildView(ent({ period: "Result", home_score: 24, away_score: 17 }), "en", "UTC");
    expect(v.mode).toBe("final");
    expect(v.headline).toBe("24 – 17");
    expect(v.badge).toBe("Full time");
  });

  it.each(["Postponed", "Cancelled"])("%s is upcoming with badge", (p) => {
    const v = buildView(ent({ period: p }), "en-GB", "UTC");
    expect(v.mode).toBe("upcoming");
    expect(v.badge).toBe(p);
    expect(v.headline).toContain("09:00");
  });

  it.each([
    undefined,
    { state: "unavailable", attributes: {} },
    { state: "unknown", attributes: {} },
    { state: "No game in progress", attributes: {} },
    { state: "x", attributes: { ...base, period: undefined } },
  ])("empty for %j", (e) => {
    const v = buildView(e as HassEntity | undefined, "en", "UTC");
    expect(v.mode).toBe("empty");
    expect(v.headline).toBe("No game");
    expect(v.home).toEqual({ name: "" });
  });

  it("wrong-typed attributes do not throw", () => {
    const bad = [
      { state: "x", attributes: null },
      ent({ period: 5 }),
      ent({ home_team: 3 }),
      ent({ logos: "nope" }),
      ent({ period: "Result", home_score: "a", away_score: {} }),
    ];
    for (const b of bad) {
      expect(() => buildView(b as unknown as HassEntity, "en", "UTC")).not.toThrow();
    }
    expect(buildView(ent({ period: 5 }), "en", "UTC").mode).toBe("empty");
    expect(buildView(ent({ home_team: 3 }), "en", "UTC").mode).toBe("empty");
  });

  it("invalid kickoff does not throw", () => {
    expect(buildView(ent({ kickoff: "garbage" }), "en", "UTC").headline).toBe("garbage");
    expect(buildView(ent({ kickoff: 12 }), "en", "UTC").headline).toBe("TBC");
  });

  it("home/away order is independent of home_away", () => {
    const a = buildView(ent({ home_away: "home" }), "en", "UTC");
    const b = buildView(ent({ home_away: "away" }), "en", "UTC");
    expect(a.home.name).toBe("Scotland");
    expect(b.home.name).toBe("Scotland");
    expect(b.away.name).toBe("Wallabies");
  });

  it("passes logos through", () => {
    const v = buildView(ent(), "en", "UTC");
    expect(v.home.logo).toBe("https://l/sco.png");
    expect(v.away.logo).toBe("https://l/aus.png");
    expect(buildView(ent({ logos: { home: null } }), "en", "UTC").home.logo).toBeUndefined();
  });
});
