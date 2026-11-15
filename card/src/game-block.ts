import { html, css, nothing, type TemplateResult } from "lit";
import { matchLinkLabel, type CardView, type TeamView } from "./state";

function team(t: TeamView): TemplateResult {
  return html`<div class="team">
    ${t.logo ? html`<img class="logo" src=${t.logo} alt="" />` : html`<div class="logo"></div>`}
    <div class="name">
      ${t.name}${t.rankLabel ? html` <span class="rank">${t.rankLabel}</span>` : nothing}
    </div>
  </div>`;
}

/** Shared game markup used by the game card and the team card. */
export function gameBlock(v: CardView): TemplateResult {
  if (v.mode === "empty") {
    return html`<div class="empty">${v.headline}</div>`;
  }
  const body = html`<div class="game ${v.mode}">
    <div class="row">
      ${team(v.home)}
      <div class="centre">
        ${v.dateLine ? html`<div class="dateline">${v.dateLine}</div>` : nothing}
        <div class="headline">${v.headline}</div>
        ${v.venue ? html`<div class="venue">${v.venue}</div>` : nothing}
        ${v.badge ? html`<div class="badge">${v.badge}</div>` : nothing}
      </div>
      ${team(v.away)}
    </div>
  </div>`;
  if (!v.matchUrl) return body;
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
