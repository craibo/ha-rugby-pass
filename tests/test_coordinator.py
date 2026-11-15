"""Tests for the update coordinator."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from unittest.mock import patch

import pytest
from homeassistant.helpers.update_coordinator import UpdateFailed
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.rugbypass.client import RugbyPassClient, RugbyPassError
from custom_components.rugbypass.const import DOMAIN
from custom_components.rugbypass.coordinator import (
    RugbyPassCoordinator,
    compute_interval,
    entry_teams,
)
from custom_components.rugbypass.models import Game, Team

NOW = datetime(2026, 11, 15, 12, 0, tzinfo=timezone.utc)
T1 = Team(1, "One", "one", "")
T2 = Team(2, "Two", "two", "")
T3 = Team(3, "Three", "three", "")


def g(gid, delta, status="fixture", live=False, home=T1, away=T2):
    return Game(
        id=gid,
        kickoff=NOW + delta,
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


def test_interval_live():
    assert compute_interval([g(1, timedelta(minutes=-10), live=True)], NOW) == timedelta(
        seconds=60
    )


def test_interval_live_beats_upcoming():
    games = [g(1, timedelta(minutes=30)), g(2, timedelta(minutes=-10), live=True)]
    assert compute_interval(games, NOW) == timedelta(seconds=60)


def test_interval_soon():
    assert compute_interval([g(1, timedelta(minutes=90))], NOW) == timedelta(minutes=15)


def test_interval_boundaries():
    assert compute_interval([g(1, timedelta(hours=2))], NOW) == timedelta(minutes=15)
    assert compute_interval([g(1, timedelta(hours=2, seconds=1))], NOW) == timedelta(
        seconds=60
    )
    # Kick-off reached but not yet flagged live: in play, poll at the live rate.
    assert compute_interval([g(1, timedelta(0))], NOW) == timedelta(seconds=60)


def test_interval_ignores_played_and_postponed():
    games = [
        g(1, timedelta(minutes=30), status="postponed"),
        g(2, timedelta(minutes=30), status="canceled"),
        g(3, timedelta(minutes=30), status="result"),
    ]
    assert compute_interval(games, NOW) == timedelta(hours=6)


def test_interval_does_not_overshoot_window():
    assert compute_interval([g(1, timedelta(hours=2, minutes=1))], NOW) == timedelta(
        seconds=60
    )
    assert compute_interval([g(1, timedelta(hours=5))], NOW) == timedelta(hours=3)
    assert compute_interval([g(1, timedelta(hours=7))], NOW) == timedelta(hours=5)
    assert compute_interval([g(1, timedelta(hours=10))], NOW) == timedelta(hours=6)
    assert compute_interval(
        [g(1, timedelta(hours=10)), g(2, timedelta(hours=5))], NOW
    ) == timedelta(hours=3)


def test_interval_empty():
    assert compute_interval([], NOW) == timedelta(hours=6)


def make(hass, teams=(1,), comps=("a",), options=None):
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={"competitions": list(comps), "teams": list(teams)},
        options=options or {},
    )
    entry.add_to_hass(hass)
    return RugbyPassCoordinator(hass, entry, RugbyPassClient(None))


def test_entry_teams_options_override(hass):
    c = make(hass, teams=(1,), options={"teams": [2, 3]})
    assert entry_teams(c.config_entry) == [2, 3]
    assert entry_teams(make(hass).config_entry) == [1]


async def test_merges_competitions(hass):
    shared = g(1, timedelta(days=1))
    other = g(2, timedelta(days=2), home=T3, away=T1)
    results = {"a": [shared], "b": [shared, other]}

    async def fetch(self, slug):
        return results[slug]

    coord = make(hass, comps=("a", "b"))
    with (
        patch.object(RugbyPassClient, "fetch_competition", fetch),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
    assert coord.last_update_success
    assert [x.id for x in coord.games] == [1, 2]
    assert coord.data[1].next.id == 1
    assert coord.data[1].current is None


async def test_interval_updated(hass):
    live = g(1, timedelta(minutes=-5), live=True)

    async def fetch(self, slug):
        return [live]

    coord = make(hass)
    with (
        patch.object(RugbyPassClient, "fetch_competition", fetch),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
    assert coord.update_interval == timedelta(seconds=60)
    assert coord.data[1].current.id == 1


async def test_only_followed_games_drive_interval(hass):
    live_other = g(1, timedelta(minutes=-5), live=True, home=T2, away=T3)

    async def fetch(self, slug):
        return [live_other]

    coord = make(hass, teams=(1,))
    with (
        patch.object(RugbyPassClient, "fetch_competition", fetch),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
    assert coord.update_interval == timedelta(hours=6)


async def test_failure_handling(hass):
    state = {"fail": False}

    async def fetch(self, slug):
        if state["fail"]:
            raise RugbyPassError("boom")
        return [g(1, timedelta(days=1))]

    coord = make(hass)
    with (
        patch.object(RugbyPassClient, "fetch_competition", fetch),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
        good = coord.data
        assert coord.last_update_success
        normal = coord.update_interval
        assert normal == timedelta(hours=6)

        state["fail"] = True
        await coord.async_refresh()
        assert coord.last_update_success and coord.data is good
        assert coord.update_interval <= timedelta(minutes=5)
        await coord.async_refresh()
        assert coord.last_update_success and coord.data is good
        await coord.async_refresh()
        assert not coord.last_update_success
        assert coord.data is good
        assert coord.update_interval <= timedelta(minutes=5)

        state["fail"] = False
        await coord.async_refresh()
        assert coord.last_update_success
        assert coord.update_interval == normal

        # counter reset: two more failures are tolerated again
        state["fail"] = True
        await coord.async_refresh()
        await coord.async_refresh()
        assert coord.last_update_success


async def test_first_refresh_failure_raises(hass):
    async def fetch(self, slug):
        raise RugbyPassError("boom")

    coord = make(hass)
    with patch.object(RugbyPassClient, "fetch_competition", fetch):
        with pytest.raises(UpdateFailed):
            await coord._async_update_data()
        await coord.async_refresh()
    assert not coord.last_update_success


# --- in play: past kick-off but not yet flagged live -------------------------


@pytest.mark.parametrize(
    "delta",
    [timedelta(seconds=-5), timedelta(hours=-2, minutes=-59), timedelta(hours=-3)],
)
def test_interval_in_play_before_live_flag(delta):
    assert compute_interval([g(1, delta)], NOW) == timedelta(seconds=60)


def test_interval_in_play_beats_future_fixture():
    games = [g(1, timedelta(hours=10)), g(2, timedelta(seconds=-5))]
    assert compute_interval(games, NOW) == timedelta(seconds=60)


def test_interval_past_window_not_in_play():
    assert compute_interval([g(1, timedelta(hours=-3, minutes=-1))], NOW) == timedelta(
        hours=6
    )
    # falls through to the other tiers
    games = [g(1, timedelta(hours=-3, minutes=-1)), g(2, timedelta(minutes=30))]
    assert compute_interval(games, NOW) == timedelta(minutes=15)


@pytest.mark.parametrize("status", ["result", "postponed", "canceled"])
def test_interval_finished_or_off_games_not_in_play(status):
    assert compute_interval(
        [g(1, timedelta(minutes=-30), status=status)], NOW
    ) == timedelta(hours=6)


def test_interval_in_play_does_not_clamp_idle_as_future():
    # An in-play game must never be treated as the "next" future kick-off.
    games = [g(1, timedelta(hours=-4)), g(2, timedelta(hours=5))]
    assert compute_interval(games, NOW) == timedelta(hours=3)


# --- backoff ------------------------------------------------------------------


async def _failure_sequence(hass, game, n):
    state = {"fail": False}

    async def fetch(self, slug):
        if state["fail"]:
            raise RugbyPassError("boom")
        return [game]

    coord = make(hass)
    seen = []
    with (
        patch.object(RugbyPassClient, "fetch_competition", fetch),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
        normal = coord.update_interval
        state["fail"] = True
        for _ in range(n):
            await coord.async_refresh()
            seen.append(coord.update_interval)
        state["fail"] = False
        await coord.async_refresh()
        assert coord.update_interval == normal
        assert coord.last_update_success
    return normal, seen


async def test_backoff_sequence(hass):
    normal, seen = await _failure_sequence(hass, g(1, timedelta(days=1)), 8)
    assert normal == timedelta(hours=6)
    assert [s.total_seconds() / 60 for s in seen] == [5, 5, 5, 10, 20, 40, 40, 40]


async def test_backoff_never_exceeds_computed_interval(hass):
    normal, seen = await _failure_sequence(
        hass, g(1, timedelta(hours=2, minutes=15)), 6
    )
    assert normal == timedelta(minutes=15)
    assert [s.total_seconds() / 60 for s in seen] == [5, 5, 5, 10, 15, 15]


async def test_backoff_while_live_stays_at_live_interval(hass):
    _, seen = await _failure_sequence(
        hass, g(1, timedelta(minutes=-5), live=True), 5
    )
    assert all(s == timedelta(seconds=60) for s in seen)


# --- per-competition isolation -------------------------------------------------


def _comp_fetch(results, failing):
    async def fetch(self, slug):
        if slug in failing:
            raise RugbyPassError(f"{slug} down")
        return results[slug]

    return fetch


async def test_one_competition_failing_keeps_its_games(hass):
    a_game = g(1, timedelta(days=1), home=T1, away=T2)
    b_game = g(2, timedelta(days=2), home=T3, away=T2)
    results = {"a": [a_game], "b": [b_game]}
    failing: set[str] = set()
    coord = make(hass, teams=(1, 3), comps=("a", "b"))
    with (
        patch.object(RugbyPassClient, "fetch_competition", _comp_fetch(results, failing)),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
        assert coord.data[3].next.id == 2

        failing.add("b")
        results["a"] = [g(5, timedelta(hours=20), home=T1, away=T2)]
        for _ in range(4):
            await coord.async_refresh()
            assert coord.last_update_success
            assert coord.data[1].next.id == 5  # fresh from a
            assert coord.data[3].next.id == 2  # kept from b
            assert {x.id for x in coord.games} == {5, 2}

        failing.clear()
        results["b"] = [g(6, timedelta(days=3), home=T3, away=T2)]
        await coord.async_refresh()
        assert coord.data[3].next.id == 6


async def test_all_competitions_failing_counts_as_failure(hass):
    results = {"a": [g(1, timedelta(days=1))], "b": [g(2, timedelta(days=2), home=T3)]}
    failing: set[str] = set()
    coord = make(hass, teams=(1, 3), comps=("a", "b"))
    with (
        patch.object(RugbyPassClient, "fetch_competition", _comp_fetch(results, failing)),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
        good = coord.data
        failing.update({"a", "b"})
        await coord.async_refresh()
        await coord.async_refresh()
        assert coord.last_update_success and coord.data is good
        await coord.async_refresh()
        assert not coord.last_update_success
        assert coord.data is good


async def test_all_competitions_failing_first_refresh_raises(hass):
    coord = make(hass, comps=("a", "b"))
    with patch.object(RugbyPassClient, "fetch_competition", _comp_fetch({}, {"a", "b"})):
        with pytest.raises(UpdateFailed):
            await coord._async_update_data()


async def test_competition_failing_three_times_without_data_fails(hass):
    results = {"a": [g(1, timedelta(days=1))]}
    coord = make(hass, teams=(1, 3), comps=("a", "b"))
    with (
        patch.object(RugbyPassClient, "fetch_competition", _comp_fetch(results, {"b"})),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
        assert coord.last_update_success
        assert coord.data[1].next.id == 1
        assert coord.update_interval <= timedelta(minutes=5)
        await coord.async_refresh()
        assert coord.last_update_success
        await coord.async_refresh()
        assert not coord.last_update_success


# --- league standings ------------------------------------------------------------


class _Clock:
    def __init__(self, now):
        self.now = now

    def __call__(self):
        return self.now


def _standings_fetch(tables, calls, failing=()):
    async def fetch(self, slug):
        calls.append(slug)
        if slug in failing:
            raise RugbyPassError(f"{slug} has no standings page")
        return dict(tables[slug])

    return fetch


async def _games(self, slug):
    return [g(1, timedelta(days=1))]


async def test_standings_fetched_on_first_refresh_and_rank(hass):
    calls: list[str] = []
    tables = {"a": {1: 3, 2: 7}, "b": {3: 1}}
    coord = make(hass, comps=("a", "b"))
    with (
        patch.object(RugbyPassClient, "fetch_competition", _games),
        patch.object(RugbyPassClient, "fetch_standings", _standings_fetch(tables, calls)),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
    assert sorted(calls) == ["a", "b"]
    assert coord.standings == tables
    assert coord.rank("a", 1) == 3
    assert coord.rank("a", 2) == 7
    assert coord.rank("b", 3) == 1
    assert coord.rank("a", 99) is None  # team not in the table
    assert coord.rank("zzz", 1) is None  # competition without standings
    assert coord.rank("", 1) is None


async def test_standings_cached_for_an_hour(hass):
    calls: list[str] = []
    tables = {"a": {1: 3}}
    clock = _Clock(NOW)
    coord = make(hass)
    with (
        patch.object(RugbyPassClient, "fetch_competition", _games),
        patch.object(RugbyPassClient, "fetch_standings", _standings_fetch(tables, calls)),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", clock),
    ):
        await coord.async_refresh()
        assert calls == ["a"]
        clock.now = NOW + timedelta(minutes=59)
        tables["a"] = {1: 5}
        await coord.async_refresh()
        assert calls == ["a"]
        assert coord.rank("a", 1) == 3
        clock.now = NOW + timedelta(hours=1)
        await coord.async_refresh()
        assert calls == ["a", "a"]
        assert coord.rank("a", 1) == 5


async def test_no_standings_page_not_rerequested_within_the_hour(hass):
    calls: list[str] = []
    clock = _Clock(NOW)
    coord = make(hass, comps=("internationals",))
    with (
        patch.object(RugbyPassClient, "fetch_competition", _games),
        patch.object(
            RugbyPassClient,
            "fetch_standings",
            _standings_fetch({}, calls, failing={"internationals"}),
        ),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", clock),
    ):
        for minutes in (0, 1, 30, 59):
            clock.now = NOW + timedelta(minutes=minutes)
            await coord.async_refresh()
            assert coord.last_update_success
        assert calls == ["internationals"]
        assert coord.rank("internationals", 1) is None
        clock.now = NOW + timedelta(hours=1, minutes=1)
        await coord.async_refresh()
        assert calls == ["internationals", "internationals"]


async def test_standings_failure_is_never_fatal_and_keeps_last_table(hass):
    calls: list[str] = []
    failing: set[str] = set()
    clock = _Clock(NOW)
    coord = make(hass)
    with (
        patch.object(RugbyPassClient, "fetch_competition", _games),
        patch.object(
            RugbyPassClient,
            "fetch_standings",
            _standings_fetch({"a": {1: 2}}, calls, failing),
        ),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", clock),
    ):
        await coord.async_refresh()
        interval = coord.update_interval
        failing.add("a")
        for hours in range(1, 6):
            clock.now = NOW + timedelta(hours=hours)
            await coord.async_refresh()
            assert coord.last_update_success
            assert coord.update_interval == interval
            assert coord._failures == 0
            assert coord._competition_failures == {"a": 0}
            assert coord.rank("a", 1) == 2  # last good table kept
        assert len(calls) == 6


async def test_standings_failure_on_first_refresh_is_not_fatal(hass):
    coord = make(hass)
    with (
        patch.object(RugbyPassClient, "fetch_competition", _games),
        patch.object(
            RugbyPassClient, "fetch_standings", _standings_fetch({}, [], failing={"a"})
        ),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        data = await coord._async_update_data()
    assert data[1].next.id == 1
    assert coord.rank("a", 1) is None


async def test_standings_not_fetched_for_failing_competition(hass):
    calls: list[str] = []
    coord = make(hass, comps=("a", "b"))
    with (
        patch.object(
            RugbyPassClient,
            "fetch_competition",
            _comp_fetch({"a": [g(1, timedelta(days=1))]}, {"b"}),
        ),
        patch.object(
            RugbyPassClient,
            "fetch_standings",
            _standings_fetch({"a": {1: 1}, "b": {3: 1}}, calls),
        ),
        patch("custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW),
    ):
        await coord.async_refresh()
        assert calls == ["a"]
        # b comes back: its standings are fetched on the next refresh.
        with patch.object(
            RugbyPassClient,
            "fetch_competition",
            _comp_fetch({"a": [], "b": []}, set()),
        ):
            await coord.async_refresh()
    assert calls == ["a", "b"]
    assert coord.rank("b", 3) == 1
