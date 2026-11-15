import { LitElement, html, css, nothing, type PropertyValues, type TemplateResult } from "lit";
import "./editor";
import { entityChanged, pickStubEntity } from "./editor-helpers";
import { buildView, type CardView, type HassEntity, type TeamView } from "./state";

type Config = { type?: string; entity: string };
type Hass = {
  states: Record<string, HassEntity | undefined>;
  locale?: { language?: string };
  config?: { time_zone?: string };
};

export class RugbyPassGameCard extends LitElement {
  static properties = {
    _config: { state: true },
    _hass: { state: true },
  };

  declare _config?: Config;
  declare _hass?: Hass;

  static getConfigElement(): HTMLElement {
    return document.createElement("rugbypass-game-card-editor");
  }

  static getStubConfig(hass?: Hass): Config {
    return { type: "custom:rugbypass-game-card", entity: pickStubEntity(hass?.states) };
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    if (!this._config) return true;
    if (changed.has("_config")) return true;
    if (changed.has("_hass")) {
      const prev = changed.get("_hass") as Hass | undefined;
      return entityChanged(prev?.states, this._hass?.states, this._config.entity);
    }
    return true;
  }

  setConfig(config: Config): void {
    if (!config || typeof config.entity !== "string" || !config.entity) {
      throw new Error("rugbypass-game-card: 'entity' is required");
    }
    this._config = config;
  }

  set hass(hass: Hass) {
    this._hass = hass;
  }

  getCardSize(): number {
    return 2;
  }

  private _view(): CardView {
    const hass = this._hass;
    const entity = hass && this._config ? hass.states[this._config.entity] : undefined;
    return buildView(entity, hass?.locale?.language ?? "en", hass?.config?.time_zone ?? "UTC");
  }

  private _team(t: TeamView): TemplateResult {
    return html`<div class="team">
      ${t.logo ? html`<img class="logo" src=${t.logo} alt="" />` : html`<div class="logo"></div>`}
      <div class="name">${t.name}</div>
    </div>`;
  }

  render() {
    if (!this._config) return nothing;
    const v = this._view();
    if (v.mode === "empty") {
      return html`<ha-card><div class="empty">${v.headline}</div></ha-card>`;
    }
    return html`<ha-card class=${v.mode}>
      <div class="row">
        ${this._team(v.home)}
        <div class="centre">
          <div class="headline">${v.headline}</div>
          ${v.badge ? html`<div class="badge">${v.badge}</div>` : nothing}
        </div>
        ${this._team(v.away)}
      </div>
    </ha-card>`;
  }

  static styles = css`
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
    ha-card.live .badge {
      background: var(--error-color, #db4437);
      color: var(--text-primary-color, #fff);
    }
    ha-card.live .headline {
      color: var(--primary-color);
    }
    .empty {
      text-align: center;
      color: var(--secondary-text-color);
      padding: 8px;
    }
  `;
}

if (!customElements.get("rugbypass-game-card")) {
  customElements.define("rugbypass-game-card", RugbyPassGameCard);
}

const w = window as unknown as { customCards?: Array<Record<string, string>> };
w.customCards = w.customCards || [];
w.customCards.push({
  type: "rugbypass-game-card",
  name: "RugbyPass Game Card",
  description: "Shows a RugbyPass game: kick-off, live score or final result.",
});
