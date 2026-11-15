"""Tests for frontend card registration."""

from __future__ import annotations

import json
from datetime import timedelta
from pathlib import Path
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.rugbypass.client import RugbyPassClient
from custom_components.rugbypass.const import DOMAIN

from .test_coordinator import NOW, g

COMPONENT = Path(__file__).parent.parent / "custom_components" / "rugbypass"
URL = "/rugbypass/rugbypass-game-card.js"


@pytest.fixture(autouse=True)
def frozen_now():
    with patch(
        "custom_components.rugbypass.coordinator.dt_util.utcnow", return_value=NOW
    ):
        yield


async def _fetch(self, slug):
    return [g(1, timedelta(days=1))]


def _entry(hass):
    entry = MockConfigEntry(
        domain=DOMAIN,
        data={"competitions": ["united-rugby-championship"], "teams": [1]},
    )
    entry.add_to_hass(hass)
    return entry


async def test_registers_static_path_and_resource(hass, frontend):
    version = json.loads((COMPONENT / "manifest.json").read_text())["version"]
    register, add_js = frontend
    with (
        patch.object(RugbyPassClient, "fetch_competition", _fetch),
    ):
        entry = _entry(hass)
        assert await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()

    configs = register.call_args.args[0]
    assert len(configs) == 1
    assert configs[0].url_path == URL
    assert Path(configs[0].path).is_file()
    assert Path(configs[0].path) == COMPONENT / "www" / "rugbypass-game-card.js"
    add_js.assert_called_once()
    assert add_js.call_args.args[1] == f"{URL}?v={version}"


async def test_registers_once_across_reload_and_entries(hass, frontend):
    register, add_js = frontend
    with (
        patch.object(RugbyPassClient, "fetch_competition", _fetch),
    ):
        first = _entry(hass)
        second = _entry(hass)
        assert await hass.config_entries.async_setup(first.entry_id)
        await hass.async_block_till_done()
        assert await hass.config_entries.async_reload(first.entry_id)
        await hass.async_block_till_done()
        assert await hass.config_entries.async_reload(second.entry_id)
        await hass.async_block_till_done()

    assert register.await_count == 1
    assert add_js.call_count == 1
