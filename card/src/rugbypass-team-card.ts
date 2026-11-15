import { LitElement, html, css, nothing, type PropertyValues } from "lit";
import "./team-editor";
import { registerCard } from "./register";
import { gameBlock, gameBlockStyles } from "./game-block";
import type { HassEntity } from "./state";
import {
  buildTeamView,
  shouldUpdateTeamCard,
  teamCardSize,
  teamStubConfig,
  validateTeamConfig,
  type TeamCardView,
  type TeamConfig,
} from "./team";

type Hass = {
  states: Record<string, HassEntity | undefined>;
  locale?: { language?: string };
  config?: { time_zone?: string };
};

export class RugbyPassTeamCard extends LitElement {
  static properties = {
    _config: { state: true },
    _hass: { state: true },
  };

  declare _config?: TeamConfig;
  declare _hass?: Hass;

  static getConfigElement(): HTMLElement {
    return document.createElement("rugbypass-team-card-editor");
  }

  static getStubConfig(hass?: Hass): TeamConfig {
    return teamStubConfig(hass?.states);
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    const prev = changed.get("_hass") as Hass | undefined;
    return shouldUpdateTeamCard(
      this._config,
      changed.has("_config"),
      changed.has("_hass"),
      prev?.states,
      this._hass?.states,
    );
  }

  setConfig(config: TeamConfig): void {
    this._config = validateTeamConfig(config);
  }

  set hass(hass: Hass) {
    this._hass = hass;
  }

  getCardSize(): number {
    return teamCardSize(this._view()?.previous.length ?? 0);
  }

  private _view(): TeamCardView | undefined {
    if (!this._config) return undefined;
    const hass = this._hass;
    return buildTeamView(
      hass?.states ?? {},
      this._config,
      hass?.locale?.language ?? "en",
      hass?.config?.time_zone ?? "UTC",
    );
  }

  render() {
    const v = this._view();
    if (!v) return nothing;
    return html`<ha-card>
      ${v.heading ? html`<div class="heading">${v.heading}</div>` : nothing}
      ${gameBlock(v.top)}
      <hr class="divider" />
      ${v.previous.length === 0
        ? html`<div class="none">No previous games</div>`
        : html`<ul class="previous">
            ${v.previous.map(
              (r) => html`<li class="prev-row">
                <span class="date">${r.date}</span>
                <span class="opp"
                  >${r.opposition}${r.rankLabel
                    ? html` <span class="rank">${r.rankLabel}</span>`
                    : nothing}${r.location
                    ? html` <span class="loc">(${r.location})</span>`
                    : nothing}</span
                >
                <span class="score ${r.outcome}">${r.score}</span>
              </li>`,
            )}
          </ul>`}
    </ha-card>`;
  }

  static styles = [
    gameBlockStyles,
    css`
      .heading {
        font-size: 1.1em;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .divider {
        border: 0;
        border-top: 1px solid var(--divider-color);
        margin: 12px 0;
      }
      .previous {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .prev-row {
        display: flex;
        gap: 8px;
        align-items: baseline;
        padding: 3px 0;
        font-size: 0.9em;
      }
      .date {
        flex: 0 0 auto;
        min-width: 5.5em;
        color: var(--secondary-text-color);
      }
      .opp {
        flex: 1;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .loc,
      .prev-row .rank {
        color: var(--secondary-text-color);
      }
      .prev-row .rank {
        font-size: inherit;
      }
      .score {
        flex: 0 0 auto;
        font-weight: 600;
      }
      .score.win {
        color: var(--success-color);
      }
      .score.loss {
        color: var(--error-color);
      }
      .score.draw {
        color: var(--warning-color);
      }
      .score.unknown {
        color: var(--secondary-text-color);
      }
      .none {
        text-align: center;
        color: var(--secondary-text-color);
      }
    `,
  ];
}

if (!customElements.get("rugbypass-team-card")) {
  customElements.define("rugbypass-team-card", RugbyPassTeamCard);
}

registerCard(window as unknown as Parameters<typeof registerCard>[0], {
  type: "rugbypass-team-card",
  name: "RugbyPass Team Card",
  description: "Current or next game plus the previous five results for one team",
});
