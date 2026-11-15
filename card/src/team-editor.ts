import { LitElement, html, type TemplateResult } from "lit";
import { buildEditorConfig, type TeamConfig } from "./team";

type FormData = { entity?: string; title?: string };

const SCHEMA = [
  { name: "entity", selector: { entity: { domain: "sensor", integration: "rugby_team_tracker" } } },
  { name: "title", selector: { text: {} } },
];

const LABELS: Record<string, string> = {
  entity: "Any game sensor for the team",
  title: "Title (optional)",
};

export class RugbyTrackerTeamCardEditor extends LitElement {
  static properties = {
    _config: { state: true },
    _hass: { state: true },
  };

  declare _config?: TeamConfig;
  declare _hass?: unknown;

  setConfig(config: TeamConfig): void {
    this._config = config;
  }

  set hass(hass: unknown) {
    this._hass = hass;
  }

  private _helper = (field: { name: string }): string | undefined =>
    field.name === "entity"
      ? "Other sensors are filled in automatically. Set them individually in YAML if needed."
      : undefined;

  private _label = (field: { name: string }): string => LABELS[field.name] ?? field.name;

  private _changed(ev: CustomEvent): void {
    const value = (ev.detail?.value ?? {}) as FormData;
    const picked = typeof value.entity === "string" ? value.entity : "";
    const title = typeof value.title === "string" && value.title !== "" ? value.title : undefined;
    const config = buildEditorConfig(picked, title, this._config?.type, this._config);
    this._config = config;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }),
    );
  }

  render(): TemplateResult | undefined {
    if (!this._config) return undefined;
    const data: FormData = {
      entity: this._config.next || this._config.current || this._config.previous?.[0] || "",
      title: this._config.title ?? "",
    };
    return html`<ha-form
      .hass=${this._hass}
      .data=${data}
      .schema=${SCHEMA}
      .computeLabel=${this._label}
      .computeHelper=${this._helper}
      @value-changed=${this._changed}
    ></ha-form>`;
  }
}

if (!customElements.get("rugby-tracker-team-card-editor")) {
  customElements.define("rugby-tracker-team-card-editor", RugbyTrackerTeamCardEditor);
}
