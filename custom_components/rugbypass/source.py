"""Game sources: parse RugbyPass fixtures-results pages into games."""

from __future__ import annotations

from collections.abc import Iterator
from datetime import UTC, datetime
import html as html_lib
import json
import logging
import re
from typing import Any, Protocol, runtime_checkable

from .models import Game, Team

# RugbyPass embeds the season's games as JSON text inside a hidden div:
#   <div id="current-game-days" style="display: none;">[ {day}, ... ]</div>
# day = {"epoch", "title", "tournaments": [ {"title", "order", "games": [...]} ]}
# A sibling div, "current-final-days", holds play-off placeholders with no
# teams (only id/epoch/round/venue "TBD"); it is deliberately not read, as
# those are not followable games until RugbyPass moves them into game-days.
GAME_DAYS_MARKER = 'id="current-game-days"'
# Standings pages embed the league table the same way:
#   <div id="standings-data" style="display: none;">{...}</div>
# {"hasStandings", "standingsConference",
#  "standingsData": {"groups": [...], "standings": [{"team": {"id"}, "position"}]}}
STANDINGS_MARKER = 'id="standings-data"'

_DECODER = json.JSONDecoder()
_LEADING_DIGITS = re.compile(r"\d+")
_LOGGER = logging.getLogger(__name__)


class ParseError(Exception):
    """Raised when a page does not contain the expected inline game data."""


@runtime_checkable
class GameSource(Protocol):
    """A source of games for a competition."""

    async def fetch_competition(self, slug: str) -> list[Game]:
        """Return all games for the competition identified by ``slug``."""


def parse_games(page: str) -> list[Game]:
    """Parse a RugbyPass fixtures-results page into games."""
    games: list[Game] = []
    found = 0
    for raw in _iter_raw_games(_extract_game_days(page)):
        found += 1
        try:
            game = _to_game(raw)
        except (KeyError, TypeError, ValueError) as err:
            raise ParseError(f"Malformed game {raw.get('id')!r}: {err}") from err
        if game is not None:
            games.append(game)
    if found and not games:
        # Games were present but none had the expected shape: the page
        # format has probably changed, which must not look like "no games".
        raise ParseError(f"None of {found} games could be mapped")
    return games


def _extract_game_days(page: str) -> list[Any]:
    """Locate and decode the inline JSON array of game days."""
    return _extract_inline_json(page, GAME_DAYS_MARKER, list, "game data")


def _extract_inline_json(
    page: str, marker_text: str, expected: type, label: str
) -> Any:
    """Locate and decode inline JSON in a hidden element.

    Raw JSON is decoded in place (bracket-aware, stops at the value's end);
    an HTML-entity-escaped variant of the element text is the fallback.
    """
    marker = page.find(marker_text)
    if marker == -1:
        raise ParseError(f"No inline {label} found")
    tag_end = page.find(">", marker)
    if tag_end == -1:
        raise ParseError(f"Malformed {label} element")
    start = tag_end + 1
    end = page.find("</div>", start)
    element_text = page[start:end] if end != -1 else page[start:]
    decoded_wrong_type = False
    for text in (page[start:], html_lib.unescape(element_text)):
        try:
            data, _ = _DECODER.raw_decode(text.lstrip())
        except json.JSONDecodeError:
            continue
        if isinstance(data, expected):
            return data
        decoded_wrong_type = True
    if decoded_wrong_type:
        kind = "array" if expected is list else "object"
        raise ParseError(f"Inline {label} is not a JSON {kind}")
    raise ParseError(f"Inline {label} is malformed or truncated JSON")


def parse_standings(page: str) -> dict[int, int]:
    """Parse a RugbyPass standings page into team id -> league position.

    Only a single league table is used: pool or conference pages (such as
    the World Cup) give positions within a pool, which would read as league
    positions, so they yield an empty table, as does a page without
    standings. Entries without a usable team id and position (>= 1) are
    skipped; for a repeated team the first entry wins.
    """
    try:
        return _parse_standings(page)
    except ParseError:
        raise
    except (RecursionError, ValueError, TypeError) as err:
        # Untrusted JSON: e.g. absurd nesting or an int too long to decode.
        raise ParseError(f"Unusable standings data: {type(err).__name__}") from err


def _parse_standings(page: str) -> dict[int, int]:
    data = _extract_inline_json(page, STANDINGS_MARKER, dict, "standings data")
    if not data.get("hasStandings") or data.get("standingsConference"):
        return {}
    table = data.get("standingsData")
    if not isinstance(table, dict) or table.get("groups"):
        return {}
    standings = table.get("standings") or []
    if not isinstance(standings, list):
        return {}
    positions: dict[int, int] = {}
    for entry in standings:
        if not isinstance(entry, dict):
            continue
        team = entry.get("team")
        team_id = _as_int(team.get("id")) if isinstance(team, dict) else None
        position = _as_int(entry.get("position"))
        if team_id is None or position is None or position < 1:
            continue
        positions.setdefault(team_id, position)
    return positions


_MAX_INT_DIGITS = 9
_INT_LIMIT = 10**_MAX_INT_DIGITS


def _as_int(value: Any) -> int | None:
    """A small int (or ASCII-digit string) as int; anything else is None.

    Never raises: unusable values (bools, floats, non-ASCII digits such as
    "²", absurdly long numbers) are None.
    """
    try:
        if isinstance(value, bool):
            return None
        if isinstance(value, int):
            return value if -_INT_LIMIT < value < _INT_LIMIT else None
        if isinstance(value, str):
            text = value.strip()
            if text.isascii() and text.isdigit() and len(text) <= _MAX_INT_DIGITS:
                return int(text)
    except (TypeError, ValueError):
        pass
    return None


def _iter_raw_games(days: list[Any]) -> Iterator[dict[str, Any]]:
    """Flatten date -> tournament -> games."""
    for day in days:
        if not isinstance(day, dict):
            continue
        tournaments = day.get("tournaments") or []
        if isinstance(tournaments, dict):
            tournaments = list(tournaments.values())
        for tournament in tournaments:
            if not isinstance(tournament, dict):
                continue
            for game in tournament.get("games") or []:
                if isinstance(game, dict):
                    yield game


def _to_team(raw: Any) -> Team | None:
    if not isinstance(raw, dict) or raw.get("id") is None:
        return None
    return Team(
        id=int(raw["id"]),
        name=str(raw.get("name") or ""),
        slug=str(raw.get("baseUri") or ""),
        logo=str(raw.get("logo") or ""),
    )


def _score(value: Any) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _minute(value: Any) -> int:
    """Match minute; never fails the page.

    Stoppage time such as "45+2" keeps its leading digits (45); anything
    non-numeric ("HT", empty, missing) is 0.
    """
    if isinstance(value, bool):
        return 0
    if isinstance(value, int):
        return value
    match = _LEADING_DIGITS.match(str(value or "").strip())
    if match is None:
        if value not in (None, ""):
            _LOGGER.debug("Non-numeric live minute %r, using 0", value)
        return 0
    if match.group(0) != str(value).strip():
        _LOGGER.debug("Live minute %r read as %s", value, match.group(0))
    return int(match.group(0))


def _status(raw: dict[str, Any]) -> str:
    if raw.get("postponed"):
        return "postponed"
    if raw.get("canceled"):
        return "canceled"
    return str(raw.get("status") or "fixture")


def _to_game(raw: dict[str, Any]) -> Game | None:
    """Map one raw game; skip placeholders without teams or kick-off."""
    home = _to_team(raw.get("homeTeam"))
    away = _to_team(raw.get("awayTeam"))
    if home is None or away is None or raw.get("id") is None:
        return None
    try:
        kickoff = datetime.fromtimestamp(int(raw["epoch"]), UTC)
    except (KeyError, TypeError, ValueError, OverflowError):
        return None

    live = bool(raw.get("live"))
    status = _status(raw)
    # Unplayed fixtures carry 0-0 placeholder scores; only trust scores once
    # the game is live or has a result.
    has_scores = live or status == "result" or bool(raw.get("played"))
    return Game(
        id=int(raw["id"]),
        kickoff=kickoff,
        home=home,
        away=away,
        home_score=_score(raw.get("homeScore")) if has_scores else None,
        away_score=_score(raw.get("awayScore")) if has_scores else None,
        venue=raw.get("venue") or None,
        competition=str(raw.get("tournamentTitle") or ""),
        competition_slug=str(raw.get("tournamentUri") or ""),
        status=status,
        live=live,
        minute=_minute(raw.get("minute")),
        url=str(raw.get("url") or ""),
    )
