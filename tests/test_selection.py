"""Tests for team game selection."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from custom_components.rugby_team_tracker.models import Game, Team
from custom_components.rugby_team_tracker.selection import (
    TeamGames,
    merge_games,
    select_team_games,
)

NOW = datetime(2026, 11, 15, 12, 0, tzinfo=timezone.utc)
T1 = Team(1, "One", "one", "")
T2 = Team(2, "Two", "two", "")
T3 = Team(3, "Three", "three", "")


def g(gid, days, status="fixture", live=False, home=T1, away=T2):
    return Game(
        id=gid,
        kickoff=NOW + timedelta(days=days),
        home=home,
        away=away,
        home_score=None,
        away_score=None,
        venue=None,
        competition="c",
        status=status,
        live=live,
        minute=10 if live else 0,
        url="",
    )


def test_empty():
    assert select_team_games([], 1, NOW) == TeamGames(None, None, [])
    assert select_team_games([g(1, 1, home=T2, away=T3)], 1, NOW) == TeamGames(
        None, None, []
    )


def test_matches_by_id_home_or_away():
    games = [g(1, 1), g(2, 2, home=T2, away=T1)]
    assert select_team_games(games, 1, NOW).next.id == 1
    renamed = Team(1, "Other", "other", "")
    assert select_team_games([g(3, 1, home=renamed)], 1, NOW).next.id == 3
    assert select_team_games([g(4, 1, home=Team(9, "One", "one", ""))], 1, NOW).next is None


def test_previous_newest_first_capped_at_five():
    games = [g(i, -i, status="result") for i in (3, 1, 7, 2, 6, 4, 5)]
    prev = select_team_games(games, 1, NOW).previous
    assert [x.id for x in prev] == [1, 2, 3, 4, 5]


def test_previous_shorter_not_padded():
    games = [g(1, -2, status="result"), g(2, -1, status="result")]
    assert [x.id for x in select_team_games(games, 1, NOW).previous] == [2, 1]


def test_current_live_else_none():
    res = select_team_games([g(1, 1), g(2, 0, live=True)], 1, NOW)
    assert res.current.id == 2
    assert res.next.id == 1
    assert select_team_games([g(1, 1)], 1, NOW).current is None


def test_two_live_picks_latest_kickoff_before_now():
    games = [g(1, -1, live=True), g(2, -0.1, live=True), g(3, 0.5, live=True)]
    assert select_team_games(games, 1, NOW).current.id == 2


def test_next_earliest_future_excludes_cancelled_postponed_live_played():
    games = [
        g(1, 3),
        g(2, 1, status="postponed"),
        g(3, 1, status="canceled"),
        g(4, 2),
        g(5, 1, live=True),
        g(6, 1, status="result"),
        g(7, -1),
    ]
    assert select_team_games(games, 1, NOW).next.id == 4


def test_postponed_cancelled_not_in_previous():
    games = [
        g(1, -1, status="postponed"),
        g(2, -2, status="canceled"),
        g(3, -3, status="result"),
        g(4, -1, status="result", live=True),
    ]
    assert [x.id for x in select_team_games(games, 1, NOW).previous] == [3]


def test_merge_dedupes_first_wins_stable():
    a, b, c = g(1, 1), g(2, 2), g(3, 3)
    assert merge_games([a, b], [b, c]) == [a, b, c]


def test_merge_prefers_live_or_played_over_fixture():
    fixture = g(1, 1)
    played = g(1, 1, status="result")
    live = g(2, 1, live=True)
    out = merge_games([fixture, g(2, 1)], [played, live])
    assert out == [played, live]
    assert merge_games([played], [fixture]) == [played]


def test_previous_exactly_five():
    games = [g(i, -i, status="result") for i in (4, 2, 5, 1, 3)]
    assert [x.id for x in select_team_games(games, 1, NOW).previous] == [1, 2, 3, 4, 5]


def test_current_all_live_future_returns_earliest():
    games = [g(1, 2, live=True), g(2, 1, live=True), g(3, 3, live=True)]
    assert select_team_games(games, 1, NOW).current.id == 2
