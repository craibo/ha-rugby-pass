# Rugby Team Tracker for Home Assistant

[![Latest release](https://img.shields.io/github/v/release/craibo/ha-rugby-team-tracker)](https://github.com/craibo/ha-rugby-team-tracker/releases)
[![Downloads](https://img.shields.io/github/downloads/craibo/ha-rugby-team-tracker/total)](https://github.com/craibo/ha-rugby-team-tracker/releases)
[![Installs](https://img.shields.io/badge/dynamic/json?color=41BDF5&label=installs&query=%24.rugby_team_tracker.total&url=https%3A%2F%2Fanalytics.home-assistant.io%2Fcustom_integrations.json)](https://analytics.home-assistant.io/custom_integrations.json)

[![Open in HACS](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=craibo&repository=ha-rugby-team-tracker&category=integration)
[![Add integration](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=rugby_team_tracker)

An **unofficial** Home Assistant integration that follows rugby teams. It gives each team a device with its current, next and previous five games, with league positions and world rankings, plus two bundled Lovelace cards: a game card and a team card.

## Data source and terms

The integration reads publicly available fixture, result, standings and ranking pages from a third-party rugby website, [RugbyPass](https://www.rugbypass.com) (named here once, as a factual reference to where the data comes from). It has no public API, so the integration reads the same public pages a browser would.

- This project is unofficial and is not affiliated with, endorsed by or connected to that website.
- The website's terms of use restrict automated collection of its data and content, and its content belongs to its owners.
- You use this integration at your own risk. You must check and accept the website's terms yourself before using it.
- The pages may change or block access at any time, which would break the integration.

Polling is deliberately light: every 60 seconds only while a followed game is live, every 15 minutes when a followed game starts within 2 hours, and every 6 hours otherwise. The 6-hour idle interval is shortened so the integration wakes no later than 2 hours before the next kick-off. A followed game that is past kick-off but not yet flagged live by the data source is also polled every 60 seconds, for up to 3 hours after kick-off, so the start of a match is not missed.

One page is fetched per selected competition, however many teams you follow, and each competition is handled separately: if one page fails, that competition keeps its last known games while the others still update. When every page fails, the integration retries every 5 minutes; entities go unavailable only after 3 consecutive failures, and after that the retry delay doubles (10, 20, then 40 minutes), never waiting longer than the normal polling interval. The normal interval returns as soon as a fetch succeeds.

Ranks add, at most once an hour (the first on start-up) and whatever the polling interval, one standings request per selected league competition, plus one request for the world rankings page when the Rugby World Cup, Nations Championship or Internationals is selected (however many of them). These requests run after the games have been fetched, concurrently, and each gives up after 8 seconds. A failed rank request never affects the entities or the polling: the last known ranks are kept and the request is retried after 10 minutes.

Requires Home Assistant 2024.11 or newer.

## Install (HACS custom repository)

1. In HACS, open the menu > **Custom repositories**.
2. Add `https://github.com/craibo/ha-rugby-team-tracker` with type **Integration**.
3. Download **Rugby Team Tracker** and restart Home Assistant.

## Setup

1. Go to **Settings > Devices & services > Add integration** and choose **Rugby Team Tracker**.
2. Pick the competitions to follow. Supported:
   - United Rugby Championship
   - Top 14
   - Six Nations
   - Rugby World Cup
   - Gallagher Premiership
   - The Rugby Championship
   - Super Rugby Pacific
   - Nations Championship
   - Internationals
3. Pick the teams to follow (the list is built from the games in those competitions).
4. To change teams later, open the integration and choose **Configure**.

Each followed team becomes a device.

## Entities

Seven sensors per team:

| Entity | State |
|---|---|
| Current game | The period (for example "First Half"), or "No game in progress" |
| Next game | Kick-off date and time (timestamp) |
| Previous game 1 to 5 | Result from the team's side, for example `W 24–17` (1 is the most recent) |

Current game and Previous game 1 to 5 use a rugby ball icon. Next game keeps Home Assistant's default clock icon (it is a timestamp sensor).

Attributes on each (empty for Current game when nothing is live): `opposition`, `home_away`, `kickoff`, `venue`, `home_team`, `away_team`, `home_score`, `away_score`, `period`, `minute`, `status`, `match_url`, `logos` (`home` and `away` URLs), `home_rank` and `away_rank` (each team's league-table position or World Rugby ranking, depending on the competition, or none when unknown; see [Ranks](#ranks)).

### Ranks

`home_rank` and `away_rank` are each team's current rank, which depends on the game's competition:

- **Rugby World Cup, Nations Championship and Internationals:** the team's World Rugby men's ranking, as published by the data source on its men's world rankings page. Teams are matched by the data source's team slug. Other tournaments that only appear through Internationals (for example the Pacific Nations Cup) also use the world ranking. Teams without a world ranking (for example Gibraltar, or club sides on tour) show nothing.
- **All other competitions:** the team's position in the competition's league table, read from the competition's standings page on the data source. Six Nations and The Rugby Championship use their own tables.

Ranks are refreshed at most hourly (league tables change after each round, world rankings weekly after matches), so they are the ranks as of the last refresh, not the ranks at the time the match was played: a previous result shows where the opposition stands today. A rank is left empty when it is unknown, for example for a team that is not in the table or not ranked.

## Game card

The card is bundled with the integration, which loads it into the frontend as an extra JavaScript module; no manual resource setup is needed (reload the browser after installing). Because it is loaded this way, it does not appear under **Settings > Dashboards > Resources**. Add it from the card picker (it has a visual editor) or in YAML:

```yaml
type: custom:rugby-tracker-game-card
entity: sensor.leinster_next_game
```

It shows both teams with logos, each name followed by the team's rank (league position or world ranking, see [Ranks](#ranks)) in lighter text when known (for example `Leinster 3rd`), and:

- **Upcoming:** kick-off date and time, with the venue (when known) in lighter text under the time.
- **Live:** current score and a period/minute badge.
- **Final:** the final score.

When the card shows a current (live) or previous game, clicking the game block opens the match page on the website in a new browser tab. The website cannot be embedded in Home Assistant (it forbids framing), so a new tab is used. The next game is not clickable.

Current game is empty when nothing is live, so use a Next game or Previous game sensor for a card that always shows something.

### Markdown card alternative

```yaml
type: markdown
content: >
  {% if has_value('sensor.leinster_next_game') %}
  {% set g = states.sensor.leinster_next_game %}
  **{{ g.attributes.home_team }}** vs **{{ g.attributes.away_team }}**
  {{ as_timestamp(g.state) | timestamp_custom('%a %d %b, %H:%M') }}
  at {{ g.attributes.venue }}
  {% else %}
  No game scheduled
  {% endif %}
```

Replace `sensor.leinster_next_game` with your own entity ID.

## Team card

One card per team: the current game if one is live, otherwise the next game, with the team's previous five results listed underneath. It ships in the same bundle as the game card, so no extra setup is needed. Add it from the card picker or in YAML:

```yaml
type: custom:rugby-tracker-team-card
title: Leinster            # optional
current: sensor.leinster_current_game
next: sensor.leinster_next_game
previous:
  - sensor.leinster_previous_game_1
  - sensor.leinster_previous_game_2
  - sensor.leinster_previous_game_3
  - sensor.leinster_previous_game_4
  - sensor.leinster_previous_game_5
```

At least one of `next`, `current` or a non-empty `previous` is required; entries in `previous` beyond five are ignored. Each previous result shows the date, the opposition, its current rank (league position or world ranking) and the venue in brackets (for example `Munster 3rd (Stade de France)`; the rank and venue are in lighter text and left out when unknown), and the score coloured green for a win, red for a loss and amber for a draw. Slots with no game are left out, so a team with fewer than five past games shows fewer rows. With nothing live or scheduled the top block reads "No game". The top block shows ranks after both team names, as in the game card. Ranks use English ordinals (1st, 2nd, 3rd) when Home Assistant's language is English and `#1`, `#2` otherwise.

Clicking a previous-result row opens that match on the website in a new tab, and clicking the top block does the same when it shows a live game (rows without a match link stay plain text). The next game is not clickable. The venue of an upcoming game shows under its kick-off time.

**Visual editor:** pick any one of the team's game sensors and the editor fills in the other six from the entity-id naming (`..._current_game`, `..._next_game`, `..._previous_game_1` to `5`). If you have renamed the entities so they no longer follow that pattern, set the entity ids explicitly in YAML as above. If the sensor you pick does not follow the naming pattern, the editor sets only `next`; add `current` and `previous` in YAML.

## Upgrading from the old name (versions before 0.5.0)

The project was previously published as `ha-rugby-pass`. From version 0.5.0 the integration domain changed from `rugbypass` to `rugby_team_tracker`, so Home Assistant treats it as a new integration and nothing migrates automatically. To switch:

1. In HACS, remove the old repository entry (`craibo/ha-rugby-pass`) and add `https://github.com/craibo/ha-rugby-team-tracker` as a custom repository of type **Integration**. GitHub redirects the old URL after the repository is renamed, but re-adding is the safe route.
2. In **Settings > Devices & services**, remove the old integration entry.
3. Restart Home Assistant, download the new version in HACS, restart again, then add **Rugby Team Tracker** and re-select your competitions and teams.
4. Change dashboard cards from `custom:rugbypass-game-card` / `custom:rugbypass-team-card` to `custom:rugby-tracker-game-card` / `custom:rugby-tracker-team-card`.
5. Entity IDs (for example `sensor.leinster_next_game`) are normally unchanged because they derive from the device and entity names, but check any automations that reference the removed devices.
6. Hard-refresh the browser (Ctrl+F5 or Cmd+Shift+R) so the new card bundle loads.

## Known limitations

- The data source has no period field, so the period is derived from the minute: First Half up to minute 40, Second Half after. The half-time boundary is a guess.
- Live-game handling is based on an assumption about the data shape; no live game was available when the parser was written.
- A postponed or cancelled game is not shown in any sensor; the Next game sensor skips to the next playable fixture.
- Champions Cup is not supported yet.
- Relies on page scraping and may stop working if the website changes its pages.

## Development

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements_test.txt
.venv/bin/pytest
```

Card (TypeScript and Lit, in `card/`):

```bash
cd card
npm ci
npm run typecheck && npm test
npm run build   # writes custom_components/rugby_team_tracker/www/rugby-tracker-cards.js
```

The built bundle is committed, and CI fails if it is out of date. Release steps are in [docs/RELEASING.md](docs/RELEASING.md).

## Licence

Released under the [MIT License](LICENSE).

The integration uses its own original icon (`custom_components/rugby_team_tracker/brand/`, generated by `scripts/make_icon.py`), which is covered by the same licence.
