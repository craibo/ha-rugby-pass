"""Tests for game models and period derivation."""

from datetime import UTC, datetime

import pytest

from custom_components.rugby_team_tracker.const import PERIODS
from custom_components.rugby_team_tracker.models import Game, Team, derive_period

KICK_OFF, FIRST_HALF, HALF_TIME, SECOND_HALF, RESULT, POSTPONED, CANCELLED = PERIODS


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
        # Never "Result" while the data source still flags the game live.
        ({"status": "result", "live": True, "minute": 85}, SECOND_HALF),
        # The status text is the primary source (real match, 2026-11-15).
        ({"status": "first half", "live": True, "minute": 31}, FIRST_HALF),
        ({"status": "halftime", "live": True, "minute": 41}, HALF_TIME),
        ({"status": "second half", "live": True, "minute": 40}, SECOND_HALF),
        ({"status": "second half", "live": True, "minute": 62}, SECOND_HALF),
        ({"status": "result", "live": False, "minute": 80}, RESULT),
        ({"status": "Half-Time", "live": True, "minute": 41}, HALF_TIME),
        ({"status": "SECOND_HALF", "live": True, "minute": 10}, SECOND_HALF),
        # Unknown live status falls back to the minute rule.
        ({"status": "extra time", "live": True, "minute": 85}, SECOND_HALF),
        ({"status": "extra time", "live": True, "minute": 20}, FIRST_HALF),
        # Unknown status that is not live is just a kick off.
        ({"status": "extra time", "live": False, "minute": 85}, KICK_OFF),
        ({"status": "postponed", "live": True, "minute": 41}, POSTPONED),
        ({"status": "canceled", "live": True, "minute": 41}, CANCELLED),
    ],
)
def test_derive_period(kwargs, expected):
    assert derive_period(make_game(**kwargs)) == expected


def test_unknown_live_status_logged_once(caplog):
    import logging

    from custom_components.rugby_team_tracker import models

    models._UNKNOWN_LOGGED.clear()
    with caplog.at_level(logging.DEBUG, logger=models.__name__):
        for _ in range(3):
            derive_period(make_game(status="penalty shootout", live=True, minute=90))
    assert sum("penalty shootout" in r.message for r in caplog.records) == 1
