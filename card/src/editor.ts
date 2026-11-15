import { LitElement, html, type TemplateResult } from "lit";

type Config = { type?: string; entity?: string };

const SCHEMA = [
  { name: "entity", selector: { entity: { domain: "sensor", integration: "rugbypass" } } },
];

export class RugbyPassGameCardEditor extends LitElement {
  static properties = {
    _config: { state: true },
    _hass: { state: true },
  };

  declare _config?: Config;
  declare _hass?: unknown;

  setConfig(config: Config): void {
    this._config = config;
  }

  set hass(hass: unknown) {
    this._hass = hass;
  }

  private _label = (field: { name: string }): string =>
    field.name === "entity" ? "Game entity" : field.name;

  private _changed(ev: CustomEvent): void {
    const config = { ...this._config, ...ev.detail.value };
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }

  render(): TemplateResult | undefined {
    if (!this._config) return undefined;
    return html`<ha-form
      .hass=${this._hass}
      .data=${this._config}
      .schema=${SCHEMA}
      .computeLabel=${this._label}
      @value-changed=${this._changed}
    ></ha-form>`;
  }
}

if (!customElements.get("rugbypass-game-card-editor")) {
  customElements.define("rugbypass-game-card-editor", RugbyPassGameCardEditor);
}
