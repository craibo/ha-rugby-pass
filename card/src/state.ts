export type HassEntity = { state: string; attributes: Record<string, unknown> };
export type TeamView = { name: string; logo?: string; score?: number };
export type CardView = {
  mode: "upcoming" | "live" | "final" | "empty";
  home: TeamView;
  away: TeamView;
  headline: string;
  badge?: string;
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

function formatKickoff(raw: unknown, locale: string, timeZone: string): string {
  const s = str(raw);
  if (!s) return "TBC";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  try {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }).format(d);
  } catch {
    return s;
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
    const home: TeamView = { name: homeName, logo: str(logos.home), score: hs };
    const away: TeamView = { name: awayName, logo: str(logos.away), score: as };
    const score = `${hs ?? "-"} – ${as ?? "-"}`;

    switch (period) {
      case "Kick off":
        return { mode: "upcoming", home, away, headline: formatKickoff(a.kickoff, locale, timeZone) };
      case "Postponed":
      case "Cancelled":
        return {
          mode: "upcoming",
          home,
          away,
          headline: formatKickoff(a.kickoff, locale, timeZone),
          badge: period,
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
        };
      }
      case "Result":
        return { mode: "final", home, away, headline: score, badge: "Full time" };
      default:
        return empty();
    }
  } catch {
    return empty();
  }
}
