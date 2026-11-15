type W = { customCards?: Array<Record<string, string>> };

/** Add a card to window.customCards once per type. */
export function registerCard(w: W, entry: Record<string, string>): void {
  w.customCards = w.customCards || [];
  if (!w.customCards.some((c) => c.type === entry.type)) w.customCards.push(entry);
}
