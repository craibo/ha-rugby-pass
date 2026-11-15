# RugbyPass for Home Assistant

An **unofficial** Home Assistant integration that follows rugby teams using the public [RugbyPass](https://www.rugbypass.com) fixtures and results pages. It gives each team a device with its current, next and previous five games, plus a bundled Lovelace card.

> **Disclaimer:** This project is not affiliated with, endorsed by or connected to RugbyPass. RugbyPass has no public API, so the integration reads the same public fixture pages a browser would. It may break at any time if the site changes. Please check RugbyPass's terms of use before using it.

Polling is deliberately light: every 60 seconds only while a followed game is live, every 15 minutes when a followed game starts within 2 hours, and every 6 hours otherwise. The 6-hour idle interval is shortened so the integration wakes no later than 2 hours before the next kick-off. A followed game that is past kick-off but not yet flagged live by RugbyPass is also polled every 60 seconds, for up to 3 hours after kick-off, so the start of a match is not missed.

One page is fetched per selected competition, however many teams you follow, and each competition is handled separately: if one page fails, that competition keeps its last known games while the others still update. When every page fails, the integration retries every 5 minutes; entities go unavailable only after 3 consecutive failures, and after that the retry delay doubles (10, 20, then 40 minutes), never waiting longer than the normal polling interval. The normal interval returns as soon as a fetch succeeds.

Requires Home Assistant 2024.11 or newer.

## Install (HACS custom repository)

1. In HACS, open the menu > **Custom repositories**.
2. Add `https://github.com/craibo/ha-rugby-pass` with type **Integration**.
3. Download **RugbyPass** and restart Home Assistant.

## Setup

1. Go to **Settings > Devices & services > Add integration** and choose **RugbyPass**.
2. Pick the competitions to follow. Supported:
   - United Rugby Championship
   - Top 14
   - Six Nations
   - Rugby World Cup
   - Gallagher Premiership
   - The Rugby Championship
   - Super Rugby Pacific
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

Attributes on each (empty for Current game when nothing is live): `opposition`, `home_away`, `kickoff`, `venue`, `home_team`, `away_team`, `home_score`, `away_score`, `period`, `minute`, `status`, `match_url`, `logos` (`home` and `away` URLs).

## Game card

The card is bundled with the integration, which loads it into the frontend as an extra JavaScript module; no manual resource setup is needed (reload the browser after installing). Because it is loaded this way, it does not appear under **Settings > Dashboards > Resources**. Add it from the card picker (it has a visual editor) or in YAML:

```yaml
type: custom:rugbypass-game-card
entity: sensor.leinster_next_game
```

It shows both teams with logos and:

- **Upcoming:** kick-off date and time.
- **Live:** current score and a period/minute badge.
- **Final:** the final score.

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

## Known limitations

- RugbyPass has no period field, so the period is derived from the minute: First Half up to minute 40, Second Half after. The half-time boundary is a guess.
- Live-game handling is based on an assumption about the data shape; no live game was available when the parser was written.
- A postponed or cancelled game is not shown in any sensor; the Next game sensor skips to the next playable fixture.
- Champions Cup is not supported yet.
- Relies on page scraping and may stop working if RugbyPass changes its pages.

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
npm run build   # writes custom_components/rugbypass/www/rugbypass-game-card.js
```

The built bundle is committed, and CI fails if it is out of date. Release steps are in [docs/RELEASING.md](docs/RELEASING.md).

## Licence

Released under the [MIT License](LICENSE).

The RugbyPass name and logo (`custom_components/rugbypass/brand/icon.png`) are trademarks of their owner and are used here only to identify the service this integration reads from. This project is not affiliated with or endorsed by RugbyPass; the MIT licence above does not cover the logo.
