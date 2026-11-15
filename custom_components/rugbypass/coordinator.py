"""Update coordinator with adaptive polling."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.util import dt as dt_util

from .client import RugbyPassClient, RugbyPassError
from .const import DOMAIN
from .models import Game
from .selection import TeamGames, merge_games, select_team_games

_LOGGER = logging.getLogger(__name__)

LIVE_INTERVAL = timedelta(seconds=60)
SOON_INTERVAL = timedelta(minutes=15)
IDLE_INTERVAL = timedelta(hours=6)
SOON_WINDOW = timedelta(hours=2)
MAX_CONSECUTIVE_FAILURES = 3
_EXCLUDED = ("postponed", "canceled")

type RugbyPassConfigEntry = ConfigEntry[RugbyPassCoordinator]


def entry_teams(entry: ConfigEntry) -> list[int]:
    """Return followed team ids; options override data."""
    merged = {**entry.data, **entry.options}
    return [int(t) for t in merged.get("teams", [])]


def compute_interval(games: list[Game], now: datetime) -> timedelta:
    """Choose the poll interval from the followed games."""
    if any(g.live for g in games):
        return LIVE_INTERVAL
    for g in games:
        if (
            g.status == "fixture"
            and not g.live
            and now < g.kickoff <= now + SOON_WINDOW
        ):
            return SOON_INTERVAL
    return IDLE_INTERVAL


class RugbyPassCoordinator(DataUpdateCoordinator[dict[int, TeamGames]]):
    """Polls competitions and selects games for followed teams."""

    config_entry: ConfigEntry

    def __init__(
        self, hass: HomeAssistant, entry: ConfigEntry, client: RugbyPassClient
    ) -> None:
        super().__init__(
            hass,
            _LOGGER,
            config_entry=entry,
            name=DOMAIN,
            update_interval=IDLE_INTERVAL,
        )
        self.client = client
        self.games: list[Game] = []
        self._failures = 0

    async def _async_update_data(self) -> dict[int, TeamGames]:
        competitions = list(self.config_entry.data.get("competitions", []))
        try:
            lists = [await self.client.fetch_competition(s) for s in competitions]
        except RugbyPassError as err:
            self._failures += 1
            if self.data is None or self._failures >= MAX_CONSECUTIVE_FAILURES:
                raise UpdateFailed(str(err)) from err
            _LOGGER.warning(
                "Fetch failed (%s/%s), keeping last data: %s",
                self._failures,
                MAX_CONSECUTIVE_FAILURES,
                err,
            )
            return self.data

        self._failures = 0
        now = dt_util.utcnow()
        self.games = merge_games(*lists)
        teams = entry_teams(self.config_entry)
        data = {t: select_team_games(self.games, t, now) for t in teams}
        followed = [
            g for g in self.games if g.home.id in teams or g.away.id in teams
        ]
        self.update_interval = compute_interval(followed, now)
        return data
