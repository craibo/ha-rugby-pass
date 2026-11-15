"""Tests for the config flow and options flow."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import patch

import pytest
import voluptuous as vol
from homeassistant.config_entries import ConfigEntryState
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.rugby_team_tracker.client import RugbyTrackerClient, RugbyTrackerError
from custom_components.rugby_team_tracker.const import DOMAIN
from custom_components.rugby_team_tracker.models import Team

from .test_coordinator import NOW, T1, T2, T3, g

URC = "united-rugby-championship"
T14 = "top-14"


@pytest.fixture(autouse=True)
def frozen_now():
    with patch(
        "custom_components.rugby_team_tracker.coordinator.dt_util.utcnow", return_value=NOW
    ):
        yield


def games_for(slug):
    if slug == URC:
        return [g(1, timedelta(days=1), home=T1, away=T2)]
    return [g(2, timedelta(days=1), home=T2, away=T3)]


async def fetch_ok(self, slug):
    return games_for(slug)


async def fetch_fail(self, slug):
    raise RugbyTrackerError("boom")


async def fetch_empty(self, slug):
    return []


async def start(hass, comps):
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"
    return await hass.config_entries.flow.async_configure(
        result["flow_id"], {"competitions": comps}
    )


def team_options(result):
    schema = result["data_schema"].schema
    key = next(k for k in schema if k == "teams")
    return {o["value"]: o["label"] for o in schema[key].validators[0].config["options"]}


async def test_full_flow(hass):
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_ok), patch(
        "custom_components.rugby_team_tracker.async_setup_entry", return_value=True
    ):
        result = await start(hass, [URC])
        assert result["step_id"] == "teams"
        assert team_options(result) == {
            "1": "One (United Rugby Championship)",
            "2": "Two (United Rugby Championship)",
        }
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {"teams": ["2"]}
        )
        assert result["type"] is FlowResultType.CREATE_ENTRY
        assert result["title"] == "Rugby Team Tracker"
        assert result["data"] == {
            "competitions": [URC],
            "teams": [2],
            "team_names": {"2": "Two"},
        }


async def test_teams_deduped_across_competitions(hass):
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_ok):
        result = await start(hass, [URC, T14])
    opts = team_options(result)
    assert list(opts) == ["1", "3", "2"]  # sorted by name
    assert opts["2"] == "Two (United Rugby Championship, Top 14)"
    assert opts["3"] == "Three (Top 14)"


async def test_empty_competitions_rejected(hass):
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    with pytest.raises(vol.Invalid):
        await hass.config_entries.flow.async_configure(
            result["flow_id"], {"competitions": []}
        )


async def test_empty_teams_rejected(hass):
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_ok):
        result = await start(hass, [URC])
        with pytest.raises(vol.Invalid):
            await hass.config_entries.flow.async_configure(
                result["flow_id"], {"teams": []}
            )


async def test_cannot_connect(hass):
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_fail):
        result = await start(hass, [URC])
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"
    assert result["errors"] == {"base": "cannot_connect"}


async def test_no_teams(hass):
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_empty):
        result = await start(hass, [URC])
    assert result["step_id"] == "user"
    assert result["errors"] == {"base": "no_teams"}


async def test_single_instance(hass):
    MockConfigEntry(
        domain=DOMAIN,
        unique_id=DOMAIN,
        data={"competitions": [URC], "teams": [1]},
    ).add_to_hass(hass)
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": "user"}
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"


def make_entry(hass):
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id=DOMAIN,
        data={"competitions": [URC], "teams": [1], "team_names": {"1": "One"}},
    )
    entry.add_to_hass(hass)
    return entry


async def test_options_flow_updates_and_reloads(hass):
    entry = make_entry(hass)
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_ok):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        first = entry.runtime_data
        result = await hass.config_entries.options.async_init(entry.entry_id)
        assert result["type"] is FlowResultType.FORM
        assert result["step_id"] == "init"
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"teams": ["2"]}
        )
        assert result["type"] is FlowResultType.CREATE_ENTRY
        await hass.async_block_till_done()
        assert entry.options == {"teams": [2], "team_names": {"2": "Two"}}
        assert entry.state is ConfigEntryState.LOADED
        assert entry.runtime_data is not first
        assert list(entry.runtime_data.data) == [2]


async def test_options_flow_cannot_connect(hass):
    entry = make_entry(hass)
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_fail):
        result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "init"
    assert result["errors"] == {"base": "cannot_connect"}


async def test_options_flow_submit_does_not_refetch(hass):
    entry = make_entry(hass)
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_ok):
        result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["errors"] == {}
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_fail):
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"teams": ["1", "2"]}
        )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"] == {"teams": [1, 2], "team_names": {"1": "One", "2": "Two"}}


async def test_options_flow_down_can_still_unfollow(hass):
    entry = MockConfigEntry(
        domain=DOMAIN,
        unique_id=DOMAIN,
        data={
            "competitions": [URC],
            "teams": [1, 2],
            "team_names": {"1": "One", "2": "Two"},
        },
    )
    entry.add_to_hass(hass)
    with patch.object(RugbyTrackerClient, "fetch_competition", fetch_fail):
        result = await hass.config_entries.options.async_init(entry.entry_id)
        assert result["errors"] == {"base": "cannot_connect"}
        assert team_options(result) == {"1": "One", "2": "Two"}
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"teams": ["2"]}
        )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"] == {"teams": [2], "team_names": {"2": "Two"}}
