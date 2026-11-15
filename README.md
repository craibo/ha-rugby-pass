# RugbyPass for Home Assistant

An **unofficial** Home Assistant integration that follows rugby teams using the public [RugbyPass](https://www.rugbypass.com) fixtures and results pages. It gives each team a device with its current, next and previous five games, plus a bundled Lovelace card.

> **Disclaimer:** This project is not affiliated with, endorsed by or connected to RugbyPass. RugbyPass has no public API, so the integration reads the same public fixture pages a browser would. It may break at any time if the site changes. Please check RugbyPass's terms of use before using it, and keep it to personal use.

Polling is deliberately light: every 60 seconds only while a followed game is live, every 15 minutes when a followed game starts within 2 hours, and every 6 hours otherwise. One page is fetched per selected competition, however many teams you follow.

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

The card is bundled with the integration and registered automatically as a Lovelace resource; no manual resource setup is needed (reload the browser after installing). Add it from the card picker (it has a visual editor) or in YAML:

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
  {% set g = states.sensor.leinster_next_game %}
  **{{ g.attributes.home_team }}** vs **{{ g.attributes.away_team }}**
  {{ as_timestamp(g.state) | timestamp_custom('%a %d %b, %H:%M') }}
  at {{ g.attributes.venue }}
```

Replace `sensor.leinster_next_game` with your own entity ID.

## Known limitations

- RugbyPass has no period field, so the period is derived from the minute: First Half up to minute 40, Second Half after. The half-time boundary is a guess.
- Live-game handling is based on an assumption about the data shape; no live game was available when the parser was written.
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
