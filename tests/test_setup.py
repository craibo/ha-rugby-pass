"""Tests for config entry setup, reload and unload."""

from __future__ import annotations

from datetime import timedelta
from unittest.mock import patch

import pytest
from homeassistant.config_entries import ConfigEntryState
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.rugbypass.client import RugbyPassClient, RugbyPassError
from custom_components.rugbypass.const import DOMAIN
from custom_components.rugbypass.coordinator import RugbyPassCoordinator

from .test_coordinator import NOW, g


@pytest.fixture(autouse=True)
def frozen_now():
    """Select games against the fixtures' NOW, not the real clock."""
    with patch(
        "custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW
    ):
        yield


def entry_for(hass):
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={"competitions": ["united-rugby-championship"], "teams": [1]},
    )
    entry.add_to_hass(hass)
    return entry


async def test_setup_and_unload(hass):
    async def fetch(self, slug):
        return [g(1, timedelta(days=1))]

    entry = entry_for(hass)
    with patch.object(RugbyPassClient, "fetch_competition", fetch):
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.LOADED
        assert isinstance(entry.runtime_data, RugbyPassCoordinator)
        assert entry.runtime_data.data[1].next.id == 1

        assert await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.NOT_LOADED


async def test_first_refresh_failure_retries(hass):
    async def fetch(self, slug):
        raise RugbyPassError("boom")

    entry = entry_for(hass)
    with patch.object(RugbyPassClient, "fetch_competition", fetch):
        assert not await hass.config_entries.async_setup(entry.entry_id)
    assert entry.state is ConfigEntryState.SETUP_RETRY


async def test_options_change_reloads(hass):
    async def fetch(self, slug):
        return [g(1, timedelta(days=1))]

    entry = entry_for(hass)
    with patch.object(RugbyPassClient, "fetch_competition", fetch):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
        first = entry.runtime_data
        hass.config_entries.async_update_entry(entry, options={"teams": [2]})
        await hass.async_block_till_done()
        assert entry.state is ConfigEntryState.LOADED
        assert entry.runtime_data is not first
        assert list(entry.runtime_data.data) == [2]
