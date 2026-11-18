import { html, css, nothing, type TemplateResult } from "lit";
import { matchLinkLabel, matchPartLabel, teamLinkLabel, type CardView, type TeamView } from "./state";

export type GameBlockOptions = {
  /**
   * "block" (default, game card): the whole block is one link to the match,
   * for live and final games only. "parts" (team card): home team, middle
   * and away team are separate links (team page, match page, team page).
   */
  linkMode?: "block" | "parts";
};

function teamBody(t: TeamView): TemplateResult {
  return html`${t.logo
      ? html`<img class="logo" src=${t.logo} alt="" />`
      : html`<div class="logo"></div>`}
    <div class="name">
      ${t.name}${t.rankLabel ? html` <span class="rank">${t.rankLabel}</span>` : nothing}
    </div>`;
}

function team(t: TeamView, linked: boolean): TemplateResult {
  if (linked && t.url) {
    return html`<a
      class="team team-link"
      href=${t.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label=${teamLinkLabel(t.name)}
      >${teamBody(t)}</a
    >`;
  }
  return html`<div class="team">${teamBody(t)}</div>`;
}

function centreBody(v: CardView): TemplateResult {
  return html`${v.dateLine ? html`<div class="dateline">${v.dateLine}</div>` : nothing}
    <div class="headline">${v.headline}</div>
    ${v.venue ? html`<div class="venue">${v.venue}</div>` : nothing}
    ${v.badge ? html`<div class="badge">${v.badge}</div>` : nothing}`;
}

function centre(v: CardView, linked: boolean): TemplateResult {
  if (linked && v.matchUrl) {
    return html`<a
      class="centre centre-link"
      href=${v.matchUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label=${matchPartLabel()}
      >${centreBody(v)}</a
    >`;
  }
  return html`<div class="centre">${centreBody(v)}</div>`;
}

/** Shared game markup used by the game card and the team card. */
export function gameBlock(v: CardView, options: GameBlockOptions = {}): TemplateResult {
  if (v.mode === "empty") {
    return html`<div class="empty">${v.headline}</div>`;
  }
  const parts = options.linkMode === "parts";
  const body = html`<div class="game ${v.mode}">
    <div class="row">
      ${team(v.home, parts)} ${centre(v, parts)} ${team(v.away, parts)}
    </div>
  </div>`;
  // Block mode: live and final games only; an upcoming game is not clickable.
  if (parts || !v.matchUrl || (v.mode !== "live" && v.mode !== "final")) return body;
  return html`<a
    class="game-link"
    href=${v.matchUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label=${matchLinkLabel(v.home.name, v.away.name)}
    >${body}</a
  >`;
}

export const gameBlockStyles = css`
    ha-card {
      padding: 16px;
      color: var(--primary-text-color);
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .team {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-width: 0;
    }
    .logo {
      width: 56px;
      height: 56px;
      object-fit: contain;
    }
    .name {
      margin-top: 6px;
      font-weight: 500;
      max-width: 100%;
      overflow-wrap: anywhere;
    }
    .rank {
      font-size: 0.8em;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .centre {
      flex: 1;
      min-width: 0;
      text-align: center;
    }
    .headline {
      font-size: 1.4em;
      font-weight: 600;
    }
    .game.upcoming .headline {
      font-size: 1.15em;
      white-space: nowrap;
    }
    .dateline {
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
    }
    .venue {
      min-width: 0;
      max-width: 100%;
      font-size: 0.85em;
      color: var(--secondary-text-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .game-link,
    .prev-row a.prev-link {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
    }
    .game-link {
      display: block;
    }
    a.team-link,
    a.centre-link {
      color: inherit;
      text-decoration: none;
      cursor: pointer;
      border-radius: 8px;
    }
    a.centre-link {
      display: block;
    }
    a.team-link:hover,
    a.centre-link:hover,
    a.team-link:focus-visible,
    a.centre-link:focus-visible {
      background: var(--secondary-background-color);
    }
    a.team-link:focus-visible,
    a.centre-link:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .game-link:hover,
    .game-link:focus-visible,
    .prev-row a.prev-link:hover,
    .prev-row a.prev-link:focus-visible {
      background: var(--secondary-background-color);
    }
    .badge {
      display: inline-block;
      margin-top: 6px;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 0.85em;
      background: var(--secondary-background-color);
      color: var(--secondary-text-color);
    }
    ha-card .game.live .badge {
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #fff);
    }
    ha-card .game.live .headline {
      color: var(--primary-color);
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 8px;
    }
`;
