# RugbyPass Home Assistant Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A HACS custom integration (`rugbypass`) exposing current, next and previous-5 games per followed team, plus a `rugbypass-game-card` Lovelace card, in one repo.

**Architecture:** A `GameSource` parses RugbyPass fixtures pages into `Game` objects. One `DataUpdateCoordinator` per config entry polls each selected competition once; pure functions select each team's games; seven sensors per team device read from coordinator data. The card is a separate Lit/TypeScript bundle served by the integration and registered as a Lovelace resource.

**Tech Stack:** Python 3.12+, Home Assistant custom component APIs, `aiohttp`, `pytest-homeassistant-custom-component`; TypeScript, Lit, Vitest, Rollup (or esbuild).

**Spec:** `docs/superpowers/specs/2026-11-15-rugbypass-integration-design.md`

## Global Constraints

- Domain `rugbypass`; code in `custom_components/rugbypass/`; card source in `card/`, built bundle `custom_components/rugbypass/www/rugbypass-game-card.js`.
- Team identity is the numeric team `id`, never the slug; home/away from `homeTeam`/`awayTeam`, never the match URL.
- Periods are exactly: `Kick off`, `First Half`, `Second Half`, `Result`, plus `Postponed`, `Cancelled`.
- Poll interval: 60 s if a followed game is live; 15 min if one starts within 2 h; else 6 h.
- 7 sensors per team: Current game, Next game, Previous game 1–5.
- Game attributes: `opposition`, `home_away`, `kickoff`, `venue`, `home_team`, `away_team`, `home_score`, `away_score`, `period`, `minute`, `status`, `match_url`, `logos`.
- Polite User-Agent; no secrets; page parsing only through `GameSource`.
- Git author `craibo <tim@craibo.com>`; one feature branch and PR per task group, merge commit, CI green first.

## Review Focus

- Team with fewer than 5 past games: previous sensors beyond the available ones read "unknown", not an error.
- Followed team has two live games or none: current game picks the live one, else "No game in progress".
- Postponed or cancelled fixture is excluded from "next" and from "previous", but is still visible via its status.
- RugbyPass page lacks the inline JSON or returns non-200: entities keep last data, go unavailable only after repeated failure, no crash.
- Kick-off timezone/DST: stored as aware UTC datetimes from `epoch`, displayed in the HA timezone.
- Minute 40–45 and 80+ while still live: mapped consistently to First/Second Half, never "Result" until `played`.
- Same team appearing in several selected competitions: deduplicated by team `id`, games merged without duplicates by match `id`.
- Card pointed at an unavailable or empty entity: shows a "No game" state, not a JS error.

---

### Task 1: Scaffold, tooling and CI

**Files:**
- Create: `custom_components/rugbypass/{__init__.py,manifest.json,const.py}`, `hacs.json`, `requirements_test.txt`, `pyproject.toml`, `tests/__init__.py`, `tests/conftest.py`, `.github/workflows/ci.yml`

**Interfaces:**
- Produces: `const.DOMAIN = "rugbypass"`, `const.USER_AGENT`, `const.PERIODS` (the six strings above).

- [ ] **Step 1:** Write `tests/test_init.py::test_manifest_domain` asserting `manifest.json["domain"] == "rugbypass"` and `hacs.json` parses. Run `pytest tests/test_init.py -v`; expect FAIL (no files).
- [ ] **Step 2:** Create manifest (`config_flow: true`, `iot_class: cloud_polling`, `version: 0.1.0`), `hacs.json`, `const.py`, empty `async_setup_entry`/`async_unload_entry` in `__init__.py`.
- [ ] **Step 3:** CI workflow runs pytest, `hacs/action`, and `home-assistant/actions/hassfest`. Run `pytest -v`; expect PASS.
- [ ] **Step 4:** Commit `chore: scaffold integration and CI`.

### Task 2: Models and period derivation

**Files:**
- Create: `custom_components/rugbypass/models.py`, `tests/test_models.py`

**Interfaces:**
- Produces: `@dataclass(frozen=True) Team(id: int, name: str, slug: str, logo: str)`; `Game(id: int, kickoff: datetime, home: Team, away: Team, home_score: int | None, away_score: int | None, venue: str | None, competition: str, status: str, live: bool, minute: int, url: str)`; `derive_period(game: Game) -> str`.

- [ ] **Step 1:** Tests, one per row of the spec's period table plus boundaries: `upcoming` → `"Kick off"`; live minute 40 → `"First Half"`; live minute 41 → `"Second Half"`; `played` → `"Result"`; postponed → `"Postponed"`; canceled → `"Cancelled"`; live minute 0 → `"First Half"`. Expect FAIL.
- [ ] **Step 2:** Implement `derive_period`; the half-time boundary is a module constant `HALF_TIME_MINUTE = 40`.
- [ ] **Step 3:** Run `pytest tests/test_models.py -v`; expect PASS. Commit `feat: game models and period derivation`.

### Task 3: Fixtures page parser

**Files:**
- Create: `custom_components/rugbypass/source.py`, `tests/fixtures/urc_fixtures.html` (saved real page, trimmed), `tests/test_source.py`

**Interfaces:**
- Consumes: `Game`, `Team` (Task 2).
- Produces: `parse_games(html: str) -> list[Game]` (raises `ParseError` when no inline JSON is found); `class GameSource(Protocol): async def fetch_competition(self, slug: str) -> list[Game]`.

- [ ] **Step 1:** Save a real URC fixtures page as the fixture. Tests: count of games equals the known count; a known match has expected team ids, scores and aware-UTC `kickoff` from `epoch`; Cardiff Rugby has slug `cardiff-blues`; a page with no inline JSON raises `ParseError`; a postponed game is parsed with `status` preserved. Expect FAIL.
- [ ] **Step 2:** Implement `parse_games`: locate the inline JSON array (date → tournament → `games`), flatten, map fields, and tolerate missing scores (`None`).
- [ ] **Step 3:** Run tests; expect PASS. Commit `feat: parse RugbyPass fixtures page`.

### Task 4: HTTP client

**Files:**
- Create: `custom_components/rugbypass/client.py`, `tests/test_client.py`

**Interfaces:**
- Consumes: `parse_games`, `GameSource`, `const.USER_AGENT`.
- Produces: `RugbyPassClient(session: aiohttp.ClientSession)` implementing `fetch_competition(slug) -> list[Game]` and `list_competitions() -> dict[str, str]` (slug → title); raises `RugbyPassError` on non-200 or timeout.

- [ ] **Step 1:** Tests with `aioresponses`: 200 returns games; 500 raises `RugbyPassError`; request carries the `USER_AGENT` header; timeout raises `RugbyPassError`. Expect FAIL.
- [ ] **Step 2:** Implement with a 15 s timeout. Run tests; expect PASS. Commit `feat: RugbyPass HTTP client`.

### Task 5: Team game selection

**Files:**
- Create: `custom_components/rugbypass/selection.py`, `tests/test_selection.py`

**Interfaces:**
- Consumes: `Game`, `derive_period`.
- Produces: `@dataclass TeamGames(current: Game | None, next: Game | None, previous: list[Game])`; `select_team_games(games: list[Game], team_id: int, now: datetime) -> TeamGames`; `merge_games(*lists: list[Game]) -> list[Game]` (dedupe by `Game.id`).

- [ ] **Step 1:** Tests: `previous` is newest-first, capped at 5; fewer than 5 gives a shorter list; `current` is the live game else `None`; `next` is the earliest future non-cancelled game; postponed/cancelled excluded from `next` and `previous`; `merge_games` removes duplicates. Expect FAIL.
- [ ] **Step 2:** Implement. Run tests; expect PASS. Commit `feat: select current/next/previous games`.

### Task 6: Coordinator

**Files:**
- Create: `custom_components/rugbypass/coordinator.py`, `tests/test_coordinator.py`
- Modify: `custom_components/rugbypass/__init__.py`

**Interfaces:**
- Consumes: `RugbyPassClient`, `merge_games`, `select_team_games`.
- Produces: `RugbyPassCoordinator(hass, entry, client)` with `data: dict[int, TeamGames]` keyed by team id; `compute_interval(games: list[Game], now: datetime) -> timedelta`.

- [ ] **Step 1:** Tests: `compute_interval` returns 60 s with a live followed game, 15 min when kick-off is within 2 h, else 6 h; a fetch failure keeps the last data and `last_update_success` goes False only after 3 consecutive failures; a team in two competitions is merged. Expect FAIL.
- [ ] **Step 2:** Implement; `async_setup_entry` builds the client from `async_get_clientsession` and stores the coordinator in `entry.runtime_data`. Run tests; expect PASS. Commit `feat: update coordinator with adaptive polling`.

### Task 7: Config flow and options flow

**Files:**
- Create: `custom_components/rugbypass/config_flow.py`, `strings.json`, `translations/en.json`, `tests/test_config_flow.py`

**Interfaces:**
- Consumes: `RugbyPassClient.list_competitions`, `fetch_competition`.
- Produces: config entry data `{"competitions": list[str], "teams": list[int]}`; options flow to edit `teams`.

- [ ] **Step 1:** Tests using HA's flow test helpers: step 1 selects competitions; step 2 lists teams from fetched games; entry created with the selected ids; unreachable site shows a `cannot_connect` error; options flow updates teams and reloads. Expect FAIL.
- [ ] **Step 2:** Implement both flows (multi-select selectors; team label includes its competition). Run tests; expect PASS. Commit `feat: config and options flow`.

### Task 8: Sensors and devices

**Files:**
- Create: `custom_components/rugbypass/sensor.py`, `tests/test_sensor.py`
- Modify: `custom_components/rugbypass/__init__.py` (forward platform `sensor`)

**Interfaces:**
- Consumes: `RugbyPassCoordinator.data`, `TeamGames`.
- Produces: `game_attributes(game: Game, team_id: int) -> dict` with exactly the Global Constraints keys; sensors `Current game`, `Next game`, `Previous game 1`…`5` as `CoordinatorEntity`, one device per team (identifier `(DOMAIN, str(team_id))`), unique id `{team_id}_{key}`.

- [ ] **Step 1:** Tests: 7 sensors per team; Current state is period or `"No game in progress"`; Next state is the kick-off datetime (`device_class: timestamp`); Previous state like `"W 24–17"` (or `"L"`/`"D"`); unavailable previous slots give `unknown`; attribute keys match the constraint exactly; `home_away` is correct for each side. Expect FAIL.
- [ ] **Step 2:** Implement. Run tests; expect PASS. Commit `feat: team game sensors`.

### Task 9: Card scaffold and rendering logic

**Files:**
- Create: `card/package.json`, `card/tsconfig.json`, `card/rollup.config.js` (output to `custom_components/rugbypass/www/`), `card/src/state.ts`, `card/src/rugbypass-game-card.ts`, `card/test/state.test.ts`

**Interfaces:**
- Produces: `type CardView = {mode: "upcoming" | "live" | "final" | "empty"; home: TeamView; away: TeamView; headline: string; badge?: string}`; `buildView(entity: HassEntity | undefined, locale: string, timeZone: string): CardView`.

- [ ] **Step 1:** Vitest tests: upcoming → mode `upcoming`, headline is formatted kick-off date/time in the given timezone; live → score `"12 – 10"` and badge `"Second Half 63'"`; played → mode `final`, headline final score; missing or `unavailable` entity → `empty`. Expect FAIL.
- [ ] **Step 2:** Implement `buildView` and a Lit element rendering both teams with logos and the view. Run `npm test`; expect PASS. Commit `feat: game card rendering`.

### Task 10: Card editor and resource registration

**Files:**
- Create: `card/src/editor.ts`, `tests/test_frontend.py`
- Modify: `custom_components/rugbypass/__init__.py`, `card/src/rugbypass-game-card.ts` (`getConfigElement`, `getStubConfig`)

**Interfaces:**
- Consumes: built bundle path `custom_components/rugbypass/www/rugbypass-game-card.js`.
- Produces: integration registers a static path `/rugbypass/rugbypass-game-card.js` and adds it as a Lovelace module resource (`add_extra_js_url` fallback if Lovelace is YAML-mode).

- [ ] **Step 1:** Python test: after setup, the static path is registered and the resource URL contains the integration version for cache-busting. Expect FAIL.
- [ ] **Step 2:** Implement registration in `async_setup`; add the editor (entity picker filtered to `sensor.*` of this integration). Run `pytest` and `npm test`; expect PASS. Commit `feat: card editor and resource registration`.

### Task 11: Docs, validation and release

**Files:**
- Modify: `README.md`, `.github/workflows/ci.yml`; Create: `.github/workflows/release.yml`, `info.md`

- [ ] **Step 1:** Add `npm ci && npm run build && git diff --exit-code` to CI so the committed bundle stays in sync; confirm hassfest and HACS validation pass.
- [ ] **Step 2:** README: install via HACS custom repository, setup, entities, card YAML example, unofficial-source and terms-of-use disclaimer.
- [ ] **Step 3:** Release workflow zips `custom_components/rugbypass` on tag. Tag `v0.1.0`, install on a test HA, and confirm a live game updates the card (tune `HALF_TIME_MINUTE` if needed). Commit `docs: README and release workflow`.

---

## Self-review notes
- Spec coverage: data layer (2–4), selection and period (2, 5), coordinator (6), config/options (7), entities (8), card (9–10), testing/CI/release (1, 11), risks (parser fixture tests, `GameSource`, light polling).
- Type names are consistent across tasks: `Game`, `Team`, `TeamGames`, `GameSource`, `RugbyPassClient`, `RugbyPassCoordinator`, `CardView`.
