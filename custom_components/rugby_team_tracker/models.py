"""Data models for the Rugby Team Tracker integration."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import datetime

from .const import PERIODS

# Fallback only: used when a live game has a status text the integration does
# not recognise (e.g. a future "extra time"). The status text is the primary
# source of the period; the real data source restarts the minute at 40 for the
# second half, so this boundary is never used for the known statuses.
HALF_TIME_MINUTE = 40

(
    _KICK_OFF,
    _FIRST_HALF,
    _HALF_TIME,
    _SECOND_HALF,
    _RESULT,
    _POSTPONED,
    _CANCELLED,
) = PERIODS

_LOGGER = logging.getLogger(__name__)
_UNKNOWN_LOGGED: set[str] = set()


@dataclass(frozen=True)
class Team:
    """A rugby team."""

    id: int
    name: str
    slug: str
    logo: str


@dataclass(frozen=True)
class Game:
    """A single game (fixture, live or result)."""

    id: int
    kickoff: datetime
    home: Team
    away: Team
    home_score: int | None
    away_score: int | None
    venue: str | None
    competition: str
    # As reported by the data source: "fixture", "first half", "halftime",
    # "second half", "result", "postponed" or "canceled".
    status: str
    live: bool
    minute: int
    url: str
    # Data source competition slug (``tournamentUri``), e.g.
    # "united-rugby-championship"; used to look up league positions.
    competition_slug: str = ""


def _normalise(status: str) -> str:
    return "".join(c for c in status.lower() if c not in " _-")


def derive_period(game: Game) -> str:
    """Derive the match period from the data source's status text.

    The minute is only a fallback for a live game with an unknown status.
    """
    status = _normalise(game.status)
    if status == "postponed":
        return _POSTPONED
    if status == "canceled":
        return _CANCELLED
    if status == "firsthalf":
        return _FIRST_HALF
    if status == "halftime":
        return _HALF_TIME
    if status == "secondhalf":
        return _SECOND_HALF
    if status == "result" and not game.live:
        return _RESULT
    if status == "fixture" and not game.live:
        return _KICK_OFF
    if game.live:
        if game.status not in _UNKNOWN_LOGGED:
            _UNKNOWN_LOGGED.add(game.status)
            _LOGGER.debug(
                "Unknown live status %r, deriving the period from minute %s",
                game.status,
                game.minute,
            )
        return _FIRST_HALF if game.minute <= HALF_TIME_MINUTE else _SECOND_HALF
    return _KICK_OFF
