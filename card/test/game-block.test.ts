import { describe, expect, it } from "vitest";
import { gameBlock, gameBlockStyles } from "../src/game-block";
import type { CardView } from "../src/state";

const view = (over: Partial<CardView> = {}): CardView => ({
  mode: "final",
  home: { name: "Scotland" },
  away: { name: "Wales" },
  headline: "1 – 0",
  ...over,
});
const flat = (r: unknown) => JSON.stringify(r);
const rule = (sel: string) => {
  const css = gameBlockStyles.cssText;
  const m = new RegExp(`(?:^|\\})\\s*${sel.replace(".", "\\.")}\\s*\\{([^}]*)\\}`).exec(css);
  return m?.[1] ?? "";
};

describe("game block css", () => {
  it("lets the centre column shrink so a long venue ellipsises", () => {
    expect(rule(".centre")).toMatch(/min-width:\s*0/);
    const v = rule(".venue");
    expect(v).toMatch(/min-width:\s*0/);
    expect(v).toMatch(/max-width:\s*100%/);
    expect(v).toMatch(/overflow:\s*hidden/);
    expect(v).toMatch(/text-overflow:\s*ellipsis/);
    expect(v).toMatch(/white-space:\s*nowrap/);
  });
});

describe("game block link", () => {
  it("wraps in a safe new-tab link when matchUrl is set", () => {
    const url = "https://www.rugbypass.com/live/a/?g=1";
    const r = gameBlock(view({ matchUrl: url })) as unknown as { strings: string[]; values: unknown[] };
    const src = r.strings.join("|");
    expect(src).toContain('class="game-link"');
    expect(src).toContain('target="_blank"');
    expect(src).toContain('rel="noopener noreferrer"');
    expect(r.values[0]).toBe(url);
    expect(r.values[1]).toBe("Open the match on the website: Scotland v Wales");
  });
  it("has no anchor without matchUrl", () => {
    expect(flat(gameBlock(view()))).not.toContain("<a");
    expect(flat(gameBlock(view({ mode: "upcoming", venue: "Murrayfield" })))).not.toContain("<a");
  });
});

type Tpl = { strings: readonly string[]; values: unknown[] };
const isTpl = (x: unknown): x is Tpl =>
  !!x && typeof x === "object" && "strings" in x && "values" in x;
/** Flatten a Lit TemplateResult to markup; attribute values are quoted. */
function markup(x: unknown): string {
  if (x === undefined || x === null || typeof x === "symbol" || x === false) return "";
  if (Array.isArray(x)) return x.map(markup).join("");
  if (!isTpl(x)) return String(x);
  let out = "";
  x.strings.forEach((str, i) => {
    out += str;
    if (i < x.values.length) {
      const v = x.values[i];
      out += str.endsWith("=") ? `"${String(v)}"` : markup(v);
    }
  });
  return out;
}
const anchors = (m: string) => [...m.matchAll(/<a\b([^>]*)>/g)].map((a) => a[1]);
const attr = (a: string, name: string) => new RegExp(`${name}="([^"]*)"`).exec(a)?.[1];
const noNested = (m: string) => {
  let depth = 0;
  for (const t of m.matchAll(/<(\/?)a\b/g)) {
    depth += t[1] ? -1 : 1;
    if (depth > 1) return false;
  }
  return depth === 0;
};

const HOME = "https://www.rugbypass.com/teams/scotland/";
const AWAY = "https://www.rugbypass.com/teams/wales/";
const MATCH = "https://www.rugbypass.com/live/a/?g=1";
const full = (over: Partial<CardView> = {}): CardView =>
  view({
    mode: "upcoming",
    headline: "09:00",
    dateLine: "Sat, 21 Nov",
    venue: "Murrayfield",
    home: { name: "Scotland", url: HOME },
    away: { name: "Wales", url: AWAY },
    matchUrl: MATCH,
    ...over,
  });

describe("game block parts mode", () => {
  it("renders home team, middle and away team as three separate safe new-tab links", () => {
    const m = markup(gameBlock(full(), { linkMode: "parts" }));
    const a = anchors(m);
    expect(a).toHaveLength(3);
    expect(a.map((x) => attr(x, "href"))).toEqual([HOME, MATCH, AWAY]);
    expect(a.map((x) => attr(x, "aria-label"))).toEqual([
      "Open Scotland on the website",
      "Open the match on the website",
      "Open Wales on the website",
    ]);
    for (const x of a) {
      expect(x).toContain('target="_blank"');
      expect(x).toContain('rel="noopener noreferrer"');
    }
    expect(noNested(m)).toBe(true);
    expect(m).not.toContain("game-link");
  });
  it("middle content sits inside the match link, logo and name inside the team links", () => {
    const m = markup(gameBlock(full(), { linkMode: "parts" }));
    expect(m).toMatch(/<a[^>]*href="https:\/\/www\.rugbypass\.com\/teams\/scotland\/"[\s\S]*?Scotland[\s\S]*?<\/a\s*>/);
    expect(m).toMatch(/<a[^>]*href="[^"]*live[^"]*"[\s\S]*?09:00[\s\S]*?Murrayfield[\s\S]*?<\/a\s*>/);
  });
  it("a part without a url is not an anchor", () => {
    let m = markup(gameBlock(full({ home: { name: "Scotland" } }), { linkMode: "parts" }));
    expect(anchors(m).map((x) => attr(x, "href"))).toEqual([MATCH, AWAY]);
    m = markup(gameBlock(full({ matchUrl: undefined }), { linkMode: "parts" }));
    expect(anchors(m).map((x) => attr(x, "href"))).toEqual([HOME, AWAY]);
    m = markup(gameBlock(full({ matchUrl: undefined, home: { name: "S" }, away: { name: "W" } }), { linkMode: "parts" }));
    expect(m).not.toContain("<a");
    expect(m).toContain("Murrayfield");
  });
  it("applies to live and final views too", () => {
    for (const mode of ["live", "final"] as const) {
      const a = anchors(markup(gameBlock(full({ mode, headline: "1 – 0" }), { linkMode: "parts" })));
      expect(a, mode).toHaveLength(3);
    }
  });
  it("empty views have no links", () => {
    const m = markup(gameBlock(full({ mode: "empty", headline: "No game" }), { linkMode: "parts" }));
    expect(m).not.toContain("<a");
  });
  it("team names are bound as text, not markup", () => {
    const r = gameBlock(full({ home: { name: "<b>x</b>", url: HOME } }), { linkMode: "parts" }) as unknown as Tpl;
    expect(JSON.stringify(r)).not.toContain("unsafeHTML");
  });
  it("styles give the link parts pointer, inherit colour, no underline, hover and focus-visible", () => {
    const css = gameBlockStyles.cssText;
    expect(css).toMatch(/\.team-link[\s\S]*?color:\s*inherit/);
    expect(css).toMatch(/\.centre-link/);
    expect(css).toMatch(/text-decoration:\s*none/);
    expect(css).toMatch(/cursor:\s*pointer/);
    expect(css).toMatch(/\.team-link:focus-visible/);
    expect(css).toMatch(/\.centre-link:hover/);
    expect(rule(".team")).toMatch(/min-width:\s*0/);
  });
});

describe("game block block mode (game card)", () => {
  it("is the default and emits a single wrapper for live and final", () => {
    for (const mode of ["live", "final"] as const) {
      for (const opts of [undefined, { linkMode: "block" as const }]) {
        const m = markup(gameBlock(full({ mode, headline: "1 – 0" }), opts));
        expect(anchors(m), mode).toHaveLength(1);
        expect(m).toContain('class="game-link"');
        expect(attr(anchors(m)[0], "href")).toBe(MATCH);
      }
    }
  });
  it("upcoming is not clickable, even when it has urls", () => {
    expect(markup(gameBlock(full()))).not.toContain("<a");
    expect(markup(gameBlock(full(), { linkMode: "block" }))).not.toContain("<a");
    expect(markup(gameBlock(full({ badge: "Postponed" })))).not.toContain("<a");
  });
  it("never links the team parts", () => {
    const m = markup(gameBlock(full({ mode: "live" })));
    expect(m).not.toContain(HOME);
    expect(m).not.toContain(AWAY);
  });
});
