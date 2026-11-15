import { LitElement, html, nothing, type PropertyValues } from "lit";
import "./editor";
import "./rugbypass-team-card";
import { entityChanged, pickStubEntity } from "./editor-helpers";
import { registerCard } from "./register";
import { gameBlock, gameBlockStyles } from "./game-block";
import { buildView, type CardView, type HassEntity } from "./state";

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

  render() {
    if (!this._config) return nothing;
    return html`<ha-card>${gameBlock(this._view())}</ha-card>`;
  }

  static styles = gameBlockStyles;
}

if (!customElements.get("rugbypass-game-card")) {
  customElements.define("rugbypass-game-card", RugbyPassGameCard);
}

registerCard(window as unknown as Parameters<typeof registerCard>[0], {
  type: "rugbypass-game-card",
  name: "RugbyPass Game Card",
  description: "Shows a RugbyPass game: kick-off, live score or final result.",
});
