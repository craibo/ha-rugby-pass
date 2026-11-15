"""Tests for the team game sensors."""

from __future__ import annotations

from dataclasses import replace
from datetime import timedelta
from unittest.mock import patch

import pytest
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers import entity_registry as er
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.rugbypass.client import RugbyPassClient, RugbyPassError
from custom_components.rugbypass.const import DOMAIN
from custom_components.rugbypass.sensor import game_attributes

from .test_coordinator import NOW, T1, T2, T3, g

ATTR_KEYS = {
    "opposition", "home_away", "kickoff", "venue", "home_team", "away_team",
    "home_score", "away_score", "period", "minute", "status", "match_url", "logos",
    "home_rank", "away_rank",
}  # fmt: skip


@pytest.fixture(autouse=True)
def frozen_now():
    with patch(
        "custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW
    ):
        yield


def result(gid, days, hs, as_, **kw):
    return replace(
        g(gid, timedelta(days=-days), status="result", **kw),
        home_score=hs,
        away_score=as_,
        url="/match/x",
    )


async def setup(hass, games, teams=(1,), names=None, standings=None):
    async def fetch(self, slug):
        return games

    async def fetch_standings(self, slug):
        if standings is None or slug not in standings:
            raise RugbyPassError(f"{slug}: no standings page")
        return standings[slug]

    entry = MockConfigEntry(
        domain=DOMAIN,
        data={
            "competitions": ["c"],
            "teams": list(teams),
            "team_names": names or {"1": "One", "2": "Two", "3": "Three"},
        },
    )
    entry.add_to_hass(hass)
    with (
        patch.object(RugbyPassClient, "fetch_competition", fetch),
        patch.object(RugbyPassClient, "fetch_standings", fetch_standings),
    ):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    return entry


def state(hass, name):
    return hass.states.get(f"sensor.{name}")


async def test_seven_sensors_per_team(hass):
    await setup(hass, [g(1, timedelta(days=1))])
    reg = er.async_get(hass)
    ents = er.async_entries_for_config_entry(
        reg, hass.config_entries.async_entries(DOMAIN)[0].entry_id
    )
    assert len(ents) == 7
    assert {e.unique_id for e in ents} == {
        "1_current", "1_next", *(f"1_previous_{i}" for i in range(1, 6))
    }  # fmt: skip
    assert state(hass, "one_current_game") is not None
    assert state(hass, "one_previous_game_5") is not None


async def test_current_no_game(hass):
    await setup(hass, [g(1, timedelta(days=1))])
    s = state(hass, "one_current_game")
    assert s.state == "No game in progress"
    assert s.attributes.get("opposition") is None


async def test_current_live_period_and_attrs(hass):
    live = g(1, timedelta(minutes=-20), live=True)
    await setup(hass, [live])
    s = state(hass, "one_current_game")
    assert s.state == "First Half"
    assert s.attributes["minute"] == 10


async def test_next_timestamp(hass):
    await setup(hass, [g(1, timedelta(days=1))])
    s = state(hass, "one_next_game")
    assert s.state == (NOW + timedelta(days=1)).isoformat()
    assert s.attributes["device_class"] == "timestamp"
    assert s.attributes["opposition"] == "Two"


async def test_next_none(hass):
    await setup(hass, [result(1, 1, 10, 5)])
    s = state(hass, "one_next_game")
    assert s.state == "unknown"


async def test_previous_results(hass):
    games = [
        result(1, 1, 24, 17),  # home win
        result(2, 2, 10, 20),  # home loss
        result(3, 3, 15, 15),  # draw
        result(4, 4, 12, 30, home=T2, away=T1),  # away win
    ]
    await setup(hass, games)
    assert state(hass, "one_previous_game_1").state == "W 24–17"
    assert state(hass, "one_previous_game_2").state == "L 10–20"
    assert state(hass, "one_previous_game_3").state == "D 15–15"
    assert state(hass, "one_previous_game_4").state == "W 30–12"
    assert state(hass, "one_previous_game_5").state == "unknown"
    assert state(hass, "one_previous_game_5").attributes.get("opposition") is None


async def test_previous_scores_unavailable(hass):
    await setup(hass, [result(1, 1, None, None)])
    assert state(hass, "one_previous_game_1").state == "Result unavailable"


async def test_two_teams_two_devices(hass):
    games = [
        g(1, timedelta(days=1), home=T1, away=T2),
        g(2, timedelta(days=2), home=T3, away=T2),
    ]
    entry = await setup(hass, games, teams=(1, 2))
    reg = er.async_get(hass)
    assert len(er.async_entries_for_config_entry(reg, entry.entry_id)) == 14
    devs = dr.async_get(hass)
    assert devs.async_get_device(identifiers={(DOMAIN, "1")}).name == "One"
    assert devs.async_get_device(identifiers={(DOMAIN, "2")}).name == "Two"


async def test_device_links_to_rugbypass_website(hass):
    await setup(hass, [g(1, timedelta(days=1))])
    device = dr.async_get(hass).async_get_device(identifiers={(DOMAIN, "1")})
    assert device.manufacturer == "RugbyPass"
    assert device.configuration_url == "https://www.rugbypass.com"


async def test_options_teams_and_names_override(hass):
    entry = await setup(hass, [g(1, timedelta(days=1))])
    with patch.object(RugbyPassClient, "fetch_competition", _fetch_one):
        hass.config_entries.async_update_entry(
            entry, options={"teams": [2], "team_names": {"2": "Two"}}
        )
        await hass.async_block_till_done()
    reg = er.async_get(hass)
    ents = er.async_entries_for_config_entry(reg, entry.entry_id)
    assert {e.unique_id.split("_")[0] for e in ents} == {"2"}


async def _fetch_one(self, slug):
    return [g(1, timedelta(days=1))]


async def test_dropped_team_device_removed(hass):
    games = [g(1, timedelta(days=1), home=T1, away=T2)]
    entry = await setup(hass, games, teams=(1, 2))
    devs = dr.async_get(hass)
    assert devs.async_get_device(identifiers={(DOMAIN, "1")}) is not None
    assert devs.async_get_device(identifiers={(DOMAIN, "2")}) is not None
    with patch.object(RugbyPassClient, "fetch_competition", _fetch_one):
        hass.config_entries.async_update_entry(
            entry, options={"teams": [1], "team_names": {"1": "One"}}
        )
        await hass.async_block_till_done()
    assert devs.async_get_device(identifiers={(DOMAIN, "2")}) is None
    assert devs.async_get_device(identifiers={(DOMAIN, "1")}) is not None
    ents = er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id)
    assert {e.unique_id.split("_")[0] for e in ents} == {"1"}


def test_game_attributes_home_and_away():
    game = replace(
        g(1, timedelta(days=1), home=T1, away=T2),
        venue="Ground",
        url="/match/abc",
    )
    home = game_attributes(game, 1)
    away = game_attributes(game, 2)
    assert set(home) == ATTR_KEYS == set(away)
    assert home["home_away"] == "home" and away["home_away"] == "away"
    assert home["opposition"] == "Two" and away["opposition"] == "One"
    assert home["kickoff"] == game.kickoff.isoformat()
    assert home["period"] == "Kick off"
    assert home["match_url"] == "https://www.rugbypass.com/match/abc"
    assert home["logos"] == {"home": "", "away": ""}
    assert home["venue"] == "Ground"
    assert game_attributes(replace(game, url="https://x/y"), 1)["match_url"] == "https://x/y"

    assert home["home_rank"] is None and home["away_rank"] is None


def test_game_attributes_ranks_from_lookup():
    game = replace(g(1, timedelta(days=1), home=T1, away=T2), competition_slug="c")
    table = {("c", 1): 4, ("c", 2): 11}

    def ranks(slug, team_id):
        return table.get((slug, team_id))

    home = game_attributes(game, 1, ranks)
    away = game_attributes(game, 2, ranks)
    assert set(home) == ATTR_KEYS
    assert home["home_rank"] == 4 and home["away_rank"] == 11
    # Ranks belong to home/away, not to the viewing team.
    assert away["home_rank"] == 4 and away["away_rank"] == 11
    other = replace(game, away=T3)
    assert game_attributes(other, 1, ranks)["away_rank"] is None


def ranked(game):
    return replace(game, competition_slug="c")


async def test_sensor_ranks_from_standings(hass):
    games = [
        ranked(g(1, timedelta(days=1), home=T1, away=T2)),
        ranked(result(2, 1, 24, 17, home=T3, away=T1)),
    ]
    await setup(hass, games, standings={"c": {1: 3, 2: 1, 3: 12}})
    nxt = state(hass, "one_next_game").attributes
    assert nxt["home_rank"] == 3 and nxt["away_rank"] == 1
    prev = state(hass, "one_previous_game_1").attributes
    assert prev["home_rank"] == 12 and prev["away_rank"] == 3


async def test_sensor_ranks_none_without_standings(hass):
    await setup(hass, [ranked(g(1, timedelta(days=1)))])
    s = state(hass, "one_next_game")
    assert s.state == (NOW + timedelta(days=1)).isoformat()
    assert s.attributes["opposition"] == "Two"
    assert s.attributes["home_rank"] is None and s.attributes["away_rank"] is None


async def test_sensor_rank_none_for_team_not_in_table(hass):
    await setup(hass, [ranked(g(1, timedelta(days=1)))], standings={"c": {1: 2}})
    attrs = state(hass, "one_next_game").attributes
    assert attrs["home_rank"] == 2 and attrs["away_rank"] is None


async def test_pool_competition_games_have_no_ranks(hass):
    # A pool-based standings page parses to {} (see test_client): no ranks.
    await setup(hass, [ranked(g(1, timedelta(days=1)))], standings={"c": {}})
    attrs = state(hass, "one_next_game").attributes
    assert attrs["opposition"] == "Two"
    assert attrs["home_rank"] is None and attrs["away_rank"] is None
