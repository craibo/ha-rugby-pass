type States = Record<string, unknown> | undefined;

const GAME_SENSOR = /^sensor\..*(current|next|previous)_game/;

/** First sensor that looks like a data source game sensor, or "". */
export function pickStubEntity(states: States): string {
  if (!states) return "";
  return Object.keys(states).find((id) => GAME_SENSOR.test(id)) ?? "";
}

/** True when the watched entity's state object differs between two hass states. */
export function entityChanged(prev: States, next: States, entityId: string): boolean {
  if (!prev || !next) return true;
  return prev[entityId] !== next[entityId];
}

/** True when any of the watched entities' state objects differ between two hass states. */
export function entitiesChanged(prev: States, next: States, entityIds: string[]): boolean {
  if (!prev || !next) return true;
  return entityIds.some((id) => prev[id] !== next[id]);
}
