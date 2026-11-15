# RugbyPass Home Assistant Integration — Design

## Goal
A HACS-installable Home Assistant custom integration (`rugbypass`) that lets a user pick rugby teams to follow and exposes each team's current, next and previous 5 games. A companion Lovelace card shows a game on a dashboard.

## Decisions
- **Data source:** RugbyPass fixture pages read directly (no official API exists). Unofficial; may break; RugbyPass terms to be checked. Kept behind a swappable `GameSource` interface.
- **"Service" means device/entities** (HA "services" are actions). Each followed team is a device.
- **Card ships in the same repo and HACS install** as a separate frontend JS resource; the integration registers it as a Lovelace resource.

## 1. Data layer
- `client.py` fetches a competition's `.../fixtures-results/` page, extracts the inline JSON (grouped date → tournament → `games`) and returns normalised `Game` objects.
- `GameSource` interface isolates the parsing so another source can replace it.
- Fields used: `id`, `epoch`/`date`, `homeTeam`/`awayTeam` (`id`, `name`, `baseUri`, `logo`), `homeScore`, `awayScore`, `venue`, `round`, `tournamentTitle`, `status`, `upcoming`, `live`, `played`, `postponed`, `canceled`, `minute`, `url`.
- **Team identity = numeric team `id`**, not slug (slugs differ from names, e.g. Cardiff Rugby → `cardiff-blues`). Home/away from `homeTeam`/`awayTeam`, never from the match URL.
- **Period** (no explicit field exists, so derived):

  | Condition | Period |
  |---|---|
  | `upcoming` | Kick off |
  | `live`, minute ≤ 40 | First Half |
  | `live`, minute > 40 | Second Half |
  | `played` | Result |
  | `postponed` / `canceled` | Postponed / Cancelled |

  The half-time boundary is isolated in one function and tuned against a real live game.

## 2. Coordinator
One `DataUpdateCoordinator` per config entry; one page fetch per competition covers all followed teams. Interval: 60 s if a followed game is live, 15 min if one starts within 2 h, else 6 h. Polite User-Agent, backoff on errors, caching.

## 3. Config flow
Step 1: choose competitions (URC, Premiership, Top 14, internationals, ...). Step 2: multi-select teams built from fetched games. Options flow to add/remove teams.

## 4. Entities (per team device, 7 sensors)
- Current game — state: period or "No game in progress".
- Next game — state: kick-off datetime.
- Previous game 1–5 — state: result, e.g. "W 24–17".
- Attributes on each: `opposition`, `home_away`, `kickoff`, `venue`, `home_team`, `away_team`, `home_score`, `away_score`, `period`, `minute`, `status`, `match_url`, `logos`.

## 5. Game card
`rugbypass-game-card`, TypeScript + Lit, with a visual editor to pick an entity. Shows both teams with logos.

| Game state | Shows |
|---|---|
| Not started | Teams, kick-off date/time |
| Live | Teams, current score, period + minute badge |
| Finished | Teams, final score |

## 6. Testing and release
- Backend: `pytest-homeassistant-custom-component`; saved HTML fixtures for parser, coordinator, config flow.
- Card: component tests.
- CI: hassfest, HACS validation, tests. Tagged releases; installed via HACS custom repository first.

## Risks
- Page format changes break the parser → fixture tests + swappable source.
- Terms of use may restrict scraping → light polling, caching, personal use.
