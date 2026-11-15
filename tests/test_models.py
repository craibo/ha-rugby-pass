"""Tests for game models and period derivation."""

from datetime import UTC, datetime

import pytest

from custom_components.rugbypass.const import PERIODS
from custom_components.rugbypass.models import Game, Team, derive_period

KICK_OFF, FIRST_HALF, SECOND_HALF, RESULT, POSTPONED, CANCELLED = PERIODS


def make_game(status="fixture", live=False, minute=0) -> Game:
    home = Team(1, "Leinster", "leinster", "https://example.com/l.png")
    away = Team(2, "Munster", "munster", "https://example.com/m.png")
    return Game(
        id=10,
        kickoff=datetime(2026, 11, 20, 19, 35, tzinfo=UTC),
        home=home,
        away=away,
        home_score=None,
        away_score=None,
        venue="Aviva Stadium",
        competition="URC",
        status=status,
        live=live,
        minute=minute,
        url="https://example.com/game",
    )


@pytest.mark.parametrize(
    ("kwargs", "expected"),
    [
        ({"status": "fixture"}, KICK_OFF),
        ({"status": "fixture", "live": True, "minute": 40}, FIRST_HALF),
        ({"status": "fixture", "live": True, "minute": 41}, SECOND_HALF),
        ({"status": "fixture", "live": True, "minute": 0}, FIRST_HALF),
        ({"status": "result"}, RESULT),
        ({"status": "postponed"}, POSTPONED),
        ({"status": "canceled"}, CANCELLED),
        ({"status": "postponed", "live": True, "minute": 10}, POSTPONED),
        ({"status": "live", "live": True, "minute": 45}, SECOND_HALF),
        ({"status": "live", "live": True, "minute": 85}, SECOND_HALF),
        # Never "Result" while RugbyPass still flags the game live.
        ({"status": "result", "live": True, "minute": 85}, SECOND_HALF),
    ],
)
def test_derive_period(kwargs, expected):
    assert derive_period(make_game(**kwargs)) == expected
