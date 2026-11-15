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
    assert compute_interval([g(1, timedelta(0))], NOW) == timedelta(hours=6)


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
