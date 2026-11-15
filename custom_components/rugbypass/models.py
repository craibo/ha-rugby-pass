"""Data models for the RugbyPass integration."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from .const import PERIODS

HALF_TIME_MINUTE = 40

_KICK_OFF, _FIRST_HALF, _SECOND_HALF, _RESULT, _POSTPONED, _CANCELLED = PERIODS


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
    status: str  # "fixture", "live", "result", "postponed" or "canceled"
    live: bool
    minute: int
    url: str


def derive_period(game: Game) -> str:
    """Derive the match period; RugbyPass exposes no explicit field."""
    if game.status == "postponed":
        return _POSTPONED
    if game.status == "canceled":
        return _CANCELLED
    if game.live:
        return _FIRST_HALF if game.minute <= HALF_TIME_MINUTE else _SECOND_HALF
    if game.status == "result":
        return _RESULT
    return _KICK_OFF
