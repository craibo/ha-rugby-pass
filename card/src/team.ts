import { buildView, type CardView, type HassEntity } from "./state";

export type TeamConfig = {
  type?: string;
  title?: string;
  current?: string;
  next?: string;
  previous?: string[];
};

export type PreviousRow = {
  date: string;
  opposition: string;
  venue: "home" | "away";
  score: string;
  outcome: "win" | "loss" | "draw" | "unknown";
};

export type TeamCardView = { top: CardView; previous: PreviousRow[]; heading?: string };

const MAX_PREVIOUS = 5;
const SUFFIX = /_(?:current_game|next_game|previous_game_[1-5])$/;
const RESULT = /^([WLD]) \d+–\d+$/;

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v !== "" ? v : undefined;

export function deriveTeamEntities(
  entityId: string,
): { current: string; next: string; previous: string[] } | undefined {
  if (typeof entityId !== "string" || !SUFFIX.test(entityId)) return undefined;
  const prefix = entityId.replace(SUFFIX, "");
  return {
    current: `${prefix}_current_game`,
    next: `${prefix}_next_game`,
    previous: [1, 2, 3, 4, 5].map((n) => `${prefix}_previous_game_${n}`),
  };
}

/** Validate and normalise a config; throws when nothing is configured. */
export function validateTeamConfig(config: TeamConfig): TeamConfig {
  const previous = Array.isArray(config?.previous)
    ? config.previous.filter((e): e is string => typeof e === "string" && e !== "")
    : [];
  const current = str(config?.current);
  const next = str(config?.next);
  if (!current && !next && previous.length === 0) {
    throw new Error("rugbypass-team-card: configure at least 'next', 'current' or 'previous'");
  }
  return { ...config, previous: previous.slice(0, MAX_PREVIOUS) };
}

/** All entity ids the card watches. */
export function teamEntityIds(config: TeamConfig): string[] {
  return [config.current, config.next, ...(config.previous ?? []).slice(0, MAX_PREVIOUS)].filter(
    (e): e is string => typeof e === "string" && e !== "",
  );
}

function formatDate(raw: unknown, locale: string, timeZone: string): string {
  const s = str(raw);
  if (!s) return "–";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "2-digit",
      timeZone,
    }).format(d);
  } catch {
    return s;
  }
}

function previousRow(
  entity: HassEntity | undefined,
  locale: string,
  timeZone: string,
): PreviousRow | undefined {
  try {
    if (!entity || entity.state === "unknown" || entity.state === "unavailable") return undefined;
    const a = entity.attributes;
    if (!a || typeof a !== "object") return undefined;
    const opposition = str(a.opposition);
    if (!opposition) return undefined;
    const state = typeof entity.state === "string" ? entity.state : "";
    const m = RESULT.exec(state);
    const outcome = m ? ({ W: "win", L: "loss", D: "draw" } as const)[m[1] as "W" | "L" | "D"] : "unknown";
    return {
      date: formatDate(a.kickoff, locale, timeZone),
      opposition,
      venue: a.home_away === "away" ? "away" : "home",
      score: state || "Result unavailable",
      outcome,
    };
  } catch {
    return undefined;
  }
}

export function buildTeamView(
  states: Record<string, HassEntity | undefined>,
  config: TeamConfig,
  locale: string,
  timeZone: string,
): TeamCardView {
  const get = (id?: string) => (id ? states[id] : undefined);
  const cur = buildView(get(config.current), locale, timeZone);
  const nxt = buildView(get(config.next), locale, timeZone);
  const top =
    cur.mode === "live" ? cur : nxt.mode === "upcoming" ? nxt : buildView(undefined, locale, timeZone);
  const previous = (config.previous ?? [])
    .slice(0, MAX_PREVIOUS)
    .map((id) => previousRow(get(id), locale, timeZone))
    .filter((r): r is PreviousRow => r !== undefined);
  return { top, previous, heading: str(config.title) };
}
