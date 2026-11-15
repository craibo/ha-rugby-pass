import { describe, expect, it } from "vitest";
import { buildView, formatRank, safeMatchUrl, matchLinkLabel, type HassEntity } from "../src/state";

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
    expect(utc.dateLine).toContain("21");
    expect(utc.dateLine).not.toContain("09:00");
    expect(syd.dateLine).toContain("21");
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

  it("half time is live with the score and a badge without the minute", () => {
    const v = buildView(
      ent({ period: "Half Time", minute: 41, home_score: 12, away_score: 5, match_url: GOOD }),
      "en",
      "UTC",
    );
    expect(v.mode).toBe("live");
    expect(v.headline).toBe("12 – 5");
    expect(v.badge).toBe("Half Time");
    expect(v.home.score).toBe(12);
    expect(v.away.score).toBe(5);
    expect(v.matchUrl).toBe(GOOD);
  });

  it("half time stays defensive about wrong types", () => {
    const v = buildView(
      ent({ period: "Half Time", minute: "41", home_score: "x", away_score: null, match_url: 5 }),
      "en",
      "UTC",
    );
    expect(v.mode).toBe("live");
    expect(v.headline).toBe("- – -");
    expect(v.badge).toBe("Half Time");
    expect(v.matchUrl).toBeUndefined();
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
    expect(buildView(ent({ kickoff: "garbage" }), "en", "UTC").dateLine).toBeUndefined();
    expect(buildView(ent({ kickoff: "2026-11-21T09:00:00Z" }), "en", "Bad/Zone").headline).toBe("2026-11-21T09:00:00Z");
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

describe("formatRank", () => {
  it("uses English ordinals for en locales", () => {
    const cases: [number, string][] = [
      [1, "1st"], [2, "2nd"], [3, "3rd"], [4, "4th"], [10, "10th"],
      [11, "11th"], [12, "12th"], [13, "13th"], [14, "14th"],
      [21, "21st"], [22, "22nd"], [23, "23rd"], [24, "24th"],
      [101, "101st"], [111, "111th"], [112, "112th"],
    ];
    for (const [n, want] of cases) {
      expect(formatRank(n, "en")).toBe(want);
      expect(formatRank(n, "en-GB")).toBe(want);
      expect(formatRank(n, "en-AU")).toBe(want);
    }
  });
  it("falls back to #n for other locales", () => {
    expect(formatRank(1, "fr")).toBe("#1");
    expect(formatRank(3, "de-DE")).toBe("#3");
    expect(formatRank(12, "nl")).toBe("#12");
    expect(formatRank(2, "")).toBe("#2");
  });
  it("never throws on odd locales", () => {
    expect(() => formatRank(2, "en-!!bad")).not.toThrow();
    expect(formatRank(2, "en-!!bad")).toBe("2nd");
  });
});

describe("buildView ranks", () => {
  it("reads home_rank and away_rank", () => {
    const v = buildView(ent({ home_rank: 3, away_rank: 11 }), "en", "UTC");
    expect(v.home.rank).toBe(3);
    expect(v.away.rank).toBe(11);
    expect(v.home.rankLabel).toBe("3rd");
    expect(v.away.rankLabel).toBe("11th");
  });
  it("labels use the locale", () => {
    const v = buildView(ent({ home_rank: 1, away_rank: 2 }), "fr", "UTC");
    expect(v.home.rankLabel).toBe("#1");
    expect(v.away.rankLabel).toBe("#2");
  });
  it("ranks in live and final views too", () => {
    const live = buildView(
      ent({ period: "First Half", minute: 5, home_score: 0, away_score: 0, home_rank: 5, away_rank: 6 }),
      "en",
      "UTC",
    );
    expect([live.home.rankLabel, live.away.rankLabel]).toEqual(["5th", "6th"]);
    const fin = buildView(ent({ period: "Result", home_score: 1, away_score: 0, away_rank: 2 }), "en", "UTC");
    expect(fin.home.rank).toBeUndefined();
    expect(fin.away.rankLabel).toBe("2nd");
  });
  it("ignores missing or invalid rank types", () => {
    for (const bad of [undefined, null, "3", 0, -1, 2.5, NaN, Infinity, true, {}, [1]]) {
      const v = buildView(ent({ home_rank: bad, away_rank: bad }), "en", "UTC");
      expect(v.mode).toBe("upcoming");
      expect(v.home.rank).toBeUndefined();
      expect(v.home.rankLabel).toBeUndefined();
      expect(v.away.rank).toBeUndefined();
      expect(v.away.rankLabel).toBeUndefined();
    }
  });
});

const GOOD = "https://www.rugbypass.com/live/a-vs-b/?g=1";

describe("safeMatchUrl", () => {
  it("accepts source-site https urls and normalises", () => {
    expect(safeMatchUrl(GOOD)).toBe(GOOD);
    expect(safeMatchUrl("https://rugbypass.com/live/x/")).toBe("https://rugbypass.com/live/x/");
    expect(safeMatchUrl("https://WWW.RugbyPass.com")).toBe("https://www.rugbypass.com/");
  });
  it("rejects everything else without throwing", () => {
    const bad: unknown[] = [
      undefined, null, 1, true, {}, [GOOD], "", " ", "/live/x/", "live/x", "http://www.rugbypass.com/live/x/",
      "javascript:alert(1)", "data:text/html,hi", "https://evil.example/", "https://www.rugbypass.com.evil.example/",
      "https://evil.example/www.rugbypass.com", "https://sub.rugbypass.com/", "https://user:pw@www.rugbypass.com/",
      "https://user@www.rugbypass.com/", "//www.rugbypass.com/x", "ftp://www.rugbypass.com/",
      "https://www.rugbypass.com@evil.example/",
    ];
    for (const b of bad) expect(safeMatchUrl(b), String(b)).toBeUndefined();
  });
});

describe("buildView matchUrl and venue", () => {
  const live = { period: "First Half", minute: 3, home_score: 0, away_score: 0, match_url: GOOD };
  it("matchUrl for live and final only", () => {
    expect(buildView(ent(live), "en", "UTC").matchUrl).toBe(GOOD);
    expect(buildView(ent({ ...live, period: "Result" }), "en", "UTC").matchUrl).toBe(GOOD);
    expect(buildView(ent({ match_url: GOOD }), "en", "UTC").matchUrl).toBeUndefined();
    expect(buildView(ent({ period: "Postponed", match_url: GOOD }), "en", "UTC").matchUrl).toBeUndefined();
    expect(buildView(ent({ period: "Cancelled", match_url: GOOD }), "en", "UTC").matchUrl).toBeUndefined();
    expect(buildView({ state: "unknown", attributes: { match_url: GOOD } }, "en", "UTC").matchUrl).toBeUndefined();
  });
  it("rejects unsafe or mistyped urls without throwing", () => {
    for (const bad of ["javascript:alert(1)", "http://www.rugbypass.com/x", 5, null, {}, ""]) {
      expect(buildView(ent({ ...live, match_url: bad }), "en", "UTC").matchUrl).toBeUndefined();
    }
    expect(buildView(ent({ ...live, match_url: undefined }), "en", "UTC").mode).toBe("live");
  });
  it("venue only for upcoming, trimmed", () => {
    expect(buildView(ent({ venue: "  Murrayfield " }), "en", "UTC").venue).toBe("Murrayfield");
    expect(buildView(ent({ ...live, venue: "Murrayfield" }), "en", "UTC").venue).toBeUndefined();
    expect(buildView(ent({ period: "Result", home_score: 1, away_score: 0 }), "en", "UTC").venue).toBeUndefined();
    expect(buildView(ent({ period: "Postponed" }), "en", "UTC").venue).toBe("Murrayfield");
  });
  it("ignores empty or non-string venue", () => {
    for (const bad of ["", "   ", null, undefined, 3, {}, ["x"]]) {
      expect(buildView(ent({ venue: bad }), "en", "UTC").venue).toBeUndefined();
    }
  });
});

it("matchLinkLabel names both teams", () => {
  expect(matchLinkLabel("Scotland", "Wales")).toBe("Open the match on the website: Scotland v Wales");
});
