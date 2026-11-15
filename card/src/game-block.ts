import { html, css, nothing, type TemplateResult } from "lit";
import type { CardView, TeamView } from "./state";

function team(t: TeamView): TemplateResult {
  return html`<div class="team">
    ${t.logo ? html`<img class="logo" src=${t.logo} alt="" />` : html`<div class="logo"></div>`}
    <div class="name">${t.name}</div>
  </div>`;
}

/** Shared game markup used by the game card and the team card. */
export function gameBlock(v: CardView): TemplateResult {
  if (v.mode === "empty") {
    return html`<div class="empty">${v.headline}</div>`;
  }
  return html`<div class="game ${v.mode}">
    <div class="row">
      ${team(v.home)}
      <div class="centre">
        <div class="headline">${v.headline}</div>
        ${v.badge ? html`<div class="badge">${v.badge}</div>` : nothing}
      </div>
      ${team(v.away)}
    </div>
  </div>`;
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
    }
    .centre {
      flex: 1;
      text-align: center;
    }
    .headline {
      font-size: 1.4em;
      font-weight: 600;
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
