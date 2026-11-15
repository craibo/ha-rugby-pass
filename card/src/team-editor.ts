import { LitElement, html, type TemplateResult } from "lit";
import { deriveTeamEntities, type TeamConfig } from "./team";

type FormData = { entity?: string; title?: string };

const SCHEMA = [
  { name: "entity", selector: { entity: { domain: "sensor", integration: "rugbypass" } } },
  { name: "title", selector: { text: {} } },
];

const LABELS: Record<string, string> = {
  entity: "Any game sensor for the team",
  title: "Title (optional)",
};

export class RugbyPassTeamCardEditor extends LitElement {
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

  private _label = (field: { name: string }): string => LABELS[field.name] ?? field.name;

  private _changed(ev: CustomEvent): void {
    const value = (ev.detail?.value ?? {}) as FormData;
    const picked = typeof value.entity === "string" ? value.entity : "";
    const title = typeof value.title === "string" && value.title !== "" ? value.title : undefined;
    const derived = picked ? deriveTeamEntities(picked) : undefined;
    const config: TeamConfig = { type: this._config?.type ?? "custom:rugbypass-team-card" };
    if (title) config.title = title;
    if (derived) {
      config.current = derived.current;
      config.next = derived.next;
      config.previous = [...derived.previous];
    } else {
      config.next = picked;
    }
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
      @value-changed=${this._changed}
    ></ha-form>`;
  }
}

if (!customElements.get("rugbypass-team-card-editor")) {
  customElements.define("rugbypass-team-card-editor", RugbyPassTeamCardEditor);
}
