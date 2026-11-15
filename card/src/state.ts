export type HassEntity = { state: string; attributes: Record<string, unknown> };
export type TeamView = {
  name: string;
  logo?: string;
  score?: number;
  /** Rank (league position or world ranking, from RugbyPass), if known. */
  rank?: number;
  /** `rank` formatted for the locale, e.g. "3rd" or "#3". */
  rankLabel?: string;
};
export type CardView = {
  mode: "upcoming" | "live" | "final" | "empty";
  home: TeamView;
  away: TeamView;
  headline: string;
  badge?: string;
  /** Upcoming only: the kick-off date, shown above the time (headline). */
  dateLine?: string;
  /** Upcoming only: the venue, shown under the kick-off time. */
  venue?: string;
  /** Live and final only: absolute RugbyPass match page (validated). */
  matchUrl?: string;
};

const EMPTY: CardView = {
  mode: "empty",
  home: { name: "" },
  away: { name: "" },
  headline: "No game",
};

const empty = (): CardView => ({ ...EMPTY, home: { name: "" }, away: { name: "" } });

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v !== "" ? v : undefined;
const num = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isFinite(v) ? v : undefined;

const RUGBYPASS_HOSTS = new Set(["www.rugbypass.com", "rugbypass.com"]);

/** A RugbyPass https URL (normalised), else undefined. Never throws. */
export function safeMatchUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim() === "") return undefined;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || !RUGBYPASS_HOSTS.has(u.hostname)) return undefined;
    if (u.username !== "" || u.password !== "" || u.port !== "") return undefined;
    return u.href;
  } catch {
    return undefined;
  }
}

/** Accessible name for a match link. */
export function matchLinkLabel(home: string, away: string): string {
  return `Open the match on RugbyPass: ${home} v ${away}`;
}

const venueOf = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;

const ORDINAL_SUFFIX: Record<string, string> = { one: "st", two: "nd", few: "rd", other: "th" };

/** A positive integer rank, else undefined. */
export const rankOf = (v: unknown): number | undefined =>
  typeof v === "number" && Number.isInteger(v) && v > 0 ? v : undefined;

/** Rank as text: English ordinals ("1st", "12th") or "#n" for other locales. */
export function formatRank(rank: number, locale: string): string {
  if (typeof locale !== "string" || !/^en(?:$|[-_])/i.test(locale)) return `#${rank}`;
  let rules: Intl.PluralRules;
  try {
    rules = new Intl.PluralRules(locale, { type: "ordinal" });
  } catch {
    rules = new Intl.PluralRules("en", { type: "ordinal" });
  }
  return `${rank}${ORDINAL_SUFFIX[rules.select(rank)] ?? "th"}`;
}

/** `{rank, rankLabel}` for a raw attribute value; empty when not a valid rank. */
export function rankFields(raw: unknown, locale: string): { rank?: number; rankLabel?: string } {
  const rank = rankOf(raw);
  return rank === undefined ? {} : { rank, rankLabel: formatRank(rank, locale) };
}

function formatKickoff(
  raw: unknown,
  locale: string,
  timeZone: string,
): { headline: string; dateLine?: string } {
  const s = str(raw);
  if (!s) return { headline: "TBC" };
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return { headline: s };
  try {
    return {
      dateLine: new Intl.DateTimeFormat(locale, {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone,
      }).format(d),
      headline: new Intl.DateTimeFormat(locale, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }).format(d),
    };
  } catch {
    return { headline: s };
  }
}

export function buildView(
  entity: HassEntity | undefined,
  locale: string,
  timeZone: string,
): CardView {
  try {
    if (!entity || entity.state === "unavailable" || entity.state === "unknown") return empty();
    const a = entity.attributes;
    if (!a || typeof a !== "object") return empty();
    const period = str(a.period);
    const homeName = str(a.home_team);
    const awayName = str(a.away_team);
    if (!period || !homeName || !awayName) return empty();

    const logos =
      a.logos && typeof a.logos === "object" ? (a.logos as Record<string, unknown>) : {};
    const hs = num(a.home_score);
    const as = num(a.away_score);
    const home: TeamView = {
      name: homeName,
      logo: str(logos.home),
      score: hs,
      ...rankFields(a.home_rank, locale),
    };
    const away: TeamView = {
      name: awayName,
      logo: str(logos.away),
      score: as,
      ...rankFields(a.away_rank, locale),
    };
    const score = `${hs ?? "-"} – ${as ?? "-"}`;

    switch (period) {
      case "Kick off":
        return {
          mode: "upcoming",
          home,
          away,
          ...formatKickoff(a.kickoff, locale, timeZone),
          venue: venueOf(a.venue),
        };
      case "Postponed":
      case "Cancelled":
        return {
          mode: "upcoming",
          home,
          away,
          ...formatKickoff(a.kickoff, locale, timeZone),
          badge: period,
          venue: venueOf(a.venue),
        };
      case "First Half":
      case "Second Half": {
        const minute = num(a.minute);
        return {
          mode: "live",
          home,
          away,
          headline: score,
          badge: minute === undefined ? period : `${period} ${minute}'`,
          matchUrl: safeMatchUrl(a.match_url),
        };
      }
      case "Result":
        return {
          mode: "final",
          home,
          away,
          headline: score,
          badge: "Full time",
          matchUrl: safeMatchUrl(a.match_url),
        };
      default:
        return empty();
    }
  } catch {
    return empty();
  }
}
