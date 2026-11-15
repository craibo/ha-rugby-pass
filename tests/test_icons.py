"""Tests for the sensor icons (icons.json)."""

from __future__ import annotations

import json
from datetime import timedelta
from pathlib import Path

from custom_components.rugbypass import sensor as sensor_mod
from custom_components.rugbypass.sensor import SLOTS

from .test_coordinator import g
from .test_sensor import setup, state

ICONS = Path(sensor_mod.__file__).parent / "icons.json"
ICON = "mdi:rugby"


def _sensor_icons() -> dict:
    return json.loads(ICONS.read_text(encoding="utf-8"))["entity"]["sensor"]


def test_icons_file_is_valid_json_with_expected_shape() -> None:
    data = json.loads(ICONS.read_text(encoding="utf-8"))
    assert set(data) == {"entity"}
    assert set(data["entity"]) == {"sensor"}
    for entry in _sensor_icons().values():
        assert entry == {"default": ICON}


def test_rugby_ball_for_all_but_next_game() -> None:
    expected = {s.translation_key for s in SLOTS if s.key != "next"}
    assert expected == {"current_game", *(f"previous_game_{i}" for i in range(1, 6))}
    assert set(_sensor_icons()) == expected
    assert "next_game" not in _sensor_icons()


def test_every_icon_key_is_a_sensor_translation_key() -> None:
    assert set(_sensor_icons()) <= {s.translation_key for s in SLOTS}


async def test_next_game_keeps_timestamp_class_and_has_no_icon_override(hass) -> None:
    await setup(hass, [g(1, timedelta(days=1))])
    nxt = state(hass, "one_next_game")
    assert nxt.attributes["device_class"] == "timestamp"
    assert "icon" not in nxt.attributes
