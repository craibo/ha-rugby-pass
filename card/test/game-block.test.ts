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
    expect(r.values[1]).toBe("Open the match on RugbyPass: Scotland v Wales");
  });
  it("has no anchor without matchUrl", () => {
    expect(flat(gameBlock(view()))).not.toContain("<a");
    expect(flat(gameBlock(view({ mode: "upcoming", venue: "Murrayfield" })))).not.toContain("<a");
  });
});
