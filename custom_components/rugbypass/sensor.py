"""Sensors for followed teams."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass
from datetime import datetime
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers import device_registry as dr
from homeassistant.helpers.device_registry import DeviceEntryType, DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import RugbyPassConfigEntry, RugbyPassCoordinator, entry_teams
from .models import Game, derive_period
from .selection import MAX_PREVIOUS, TeamGames

BASE_URL = "https://www.rugbypass.com"
NO_GAME = "No game in progress"
RESULT_UNAVAILABLE = "Result unavailable"

PARALLEL_UPDATES = 0


def game_attributes(game: Game, team_id: int) -> dict[str, Any]:
    """Build the attribute dict for a game from a team's point of view."""
    is_home = game.home.id == team_id
    opposition = game.away if is_home else game.home
    url = game.url
    if url.startswith("/"):
        url = f"{BASE_URL}{url}"
    return {
        "opposition": opposition.name,
        "home_away": "home" if is_home else "away",
        "kickoff": game.kickoff.isoformat(),
        "venue": game.venue,
        "home_team": game.home.name,
        "away_team": game.away.name,
        "home_score": game.home_score,
        "away_score": game.away_score,
        "period": derive_period(game),
        "minute": game.minute,
        "status": game.status,
        "match_url": url,
        "logos": {"home": game.home.logo, "away": game.away.logo},
    }


def format_result(game: Game, team_id: int) -> str:
    """Format a result such as 'W 24–17' from the followed team's side."""
    if game.home_score is None or game.away_score is None:
        return RESULT_UNAVAILABLE
    if game.home.id == team_id:
        mine, theirs = game.home_score, game.away_score
    else:
        mine, theirs = game.away_score, game.home_score
    letter = "W" if mine > theirs else "L" if mine < theirs else "D"
    return f"{letter} {mine}–{theirs}"


@dataclass(frozen=True, kw_only=True)
class _Slot:
    key: str
    translation_key: str
    pick: Callable[[TeamGames], Game | None]


def _previous(index: int) -> Callable[[TeamGames], Game | None]:
    return lambda tg: tg.previous[index] if index < len(tg.previous) else None


SLOTS: tuple[_Slot, ...] = (
    _Slot(key="current", translation_key="current_game", pick=lambda tg: tg.current),
    _Slot(key="next", translation_key="next_game", pick=lambda tg: tg.next),
    *(
        _Slot(
            key=f"previous_{i + 1}",
            translation_key=f"previous_game_{i + 1}",
            pick=_previous(i),
        )
        for i in range(MAX_PREVIOUS)
    ),
)


def _team_name(entry: RugbyPassConfigEntry, team_id: int) -> str:
    for source in (entry.options, entry.data):
        names = source.get("team_names") or {}
        if str(team_id) in names:
            return names[str(team_id)]
    return str(team_id)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: RugbyPassConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Create seven sensors for each followed team."""
    coordinator = entry.runtime_data
    teams = entry_teams(entry)
    # Drop devices (and their entities) of teams no longer followed.
    registry = dr.async_get(hass)
    followed = {str(t) for t in teams}
    for device in dr.async_entries_for_config_entry(registry, entry.entry_id):
        ids = {i for d, i in device.identifiers if d == DOMAIN}
        if ids and not ids & followed:
            registry.async_update_device(
                device.id, remove_config_entry_id=entry.entry_id
            )
    async_add_entities(
        TeamGameSensor(coordinator, team_id, _team_name(entry, team_id), slot)
        for team_id in teams
        for slot in SLOTS
    )


class TeamGameSensor(CoordinatorEntity[RugbyPassCoordinator], SensorEntity):
    """One game slot (current, next or previous N) for a team."""

    _attr_has_entity_name = True

    def __init__(
        self,
        coordinator: RugbyPassCoordinator,
        team_id: int,
        team_name: str,
        slot: _Slot,
    ) -> None:
        super().__init__(coordinator)
        self._team_id = team_id
        self._slot = slot
        self._attr_translation_key = slot.translation_key
        self._attr_unique_id = f"{team_id}_{slot.key}"
        if slot.key == "next":
            self._attr_device_class = SensorDeviceClass.TIMESTAMP
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, str(team_id))},
            name=team_name,
            manufacturer="RugbyPass",
            entry_type=DeviceEntryType.SERVICE,
        )

    @property
    def _game(self) -> Game | None:
        games = (self.coordinator.data or {}).get(self._team_id)
        return self._slot.pick(games) if games else None

    @property
    def native_value(self) -> str | datetime | None:
        game = self._game
        key = self._slot.key
        if key == "current":
            return derive_period(game) if game and game.live else NO_GAME
        if game is None:
            return None
        if key == "next":
            return game.kickoff
        return format_result(game, self._team_id)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        game = self._game
        if game is None or (self._slot.key == "current" and not game.live):
            return {}
        return game_attributes(game, self._team_id)
