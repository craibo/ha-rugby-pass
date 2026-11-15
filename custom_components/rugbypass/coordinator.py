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
RETRY_INTERVAL = timedelta(minutes=5)
MAX_RETRY_INTERVAL = timedelta(minutes=40)
MIN_INTERVAL = timedelta(seconds=60)
IN_PLAY_WINDOW = timedelta(hours=3)
# League tables change at most once a match day; one request per followed
# competition per hour is plenty (and never adds to the 60 s live polling).
STANDINGS_INTERVAL = timedelta(hours=1)
_NOT_IN_PLAY = ("result", "postponed", "canceled")

type RugbyPassConfigEntry = ConfigEntry[RugbyPassCoordinator]


def entry_teams(entry: ConfigEntry) -> list[int]:
    """Return followed team ids; options override data."""
    merged = {**entry.data, **entry.options}
    return [int(t) for t in merged.get("teams", [])]


def is_in_play(game: Game, now: datetime) -> bool:
    """Past kick-off (by up to 3 h) and not finished or called off.

    RugbyPass can take a while to flip ``live`` after kick-off; such a game
    must be polled at the live rate rather than ignored.
    """
    return (
        game.status not in _NOT_IN_PLAY
        and now - IN_PLAY_WINDOW <= game.kickoff <= now
    )


def compute_interval(games: list[Game], now: datetime) -> timedelta:
    """Choose the poll interval from the followed games."""
    if any(g.live or is_in_play(g, now) for g in games):
        return LIVE_INTERVAL
    upcoming = [
        g.kickoff
        for g in games
        if g.status == "fixture" and not g.live and g.kickoff > now
    ]
    if not upcoming:
        return IDLE_INTERVAL
    earliest = min(upcoming)
    if earliest <= now + SOON_WINDOW:
        return SOON_INTERVAL
    # Wake up when the 2 h window opens rather than overshooting it.
    wait = earliest - SOON_WINDOW - now
    return max(MIN_INTERVAL, min(IDLE_INTERVAL, wait))


def retry_interval(failures: int, computed: timedelta) -> timedelta:
    """Retry delay after ``failures`` consecutive failures.

    5 min for failures 1-3, then 10, 20 and 40 min; never longer than the
    interval that would be used without errors.
    """
    steps = max(0, failures - MAX_CONSECUTIVE_FAILURES)
    backoff = min(RETRY_INTERVAL * (2**steps), MAX_RETRY_INTERVAL)
    return min(backoff, computed)


class RugbyPassCoordinator(DataUpdateCoordinator[dict[int, TeamGames]]):
    """Polls competitions and selects games for followed teams."""

    config_entry: ConfigEntry

    def __init__(
        self, hass: HomeAssistant, entry: RugbyPassConfigEntry, client: RugbyPassClient
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
        # Consecutive refreshes in which every competition failed.
        self._failures = 0
        # Per competition: last good games and consecutive failures.
        self._competition_games: dict[str, list[Game]] = {}
        self._competition_failures: dict[str, int] = {}
        # League positions per competition: slug -> team id -> position.
        self.standings: dict[str, dict[int, int]] = {}
        # When each competition's standings were last requested (success or
        # not), so a missing page (Internationals) is asked for once an hour.
        self._standings_checked: dict[str, datetime] = {}

    def rank(self, competition_slug: str, team_id: int) -> int | None:
        """League position of a team in a competition, if known."""
        return self.standings.get(competition_slug, {}).get(team_id)

    async def _refresh_standings(self, slugs: list[str], now: datetime) -> None:
        """Fetch stale league tables; failures are never fatal."""
        for slug in slugs:
            checked = self._standings_checked.get(slug)
            if checked is not None and now - checked < STANDINGS_INTERVAL:
                continue
            self._standings_checked[slug] = now
            try:
                table = await self.client.fetch_standings(slug)
            except RugbyPassError as err:
                _LOGGER.debug("No standings for %s, keeping the last: %s", slug, err)
                continue
            self.standings[slug] = table

    def _followed(self, games: list[Game]) -> list[Game]:
        teams = entry_teams(self.config_entry)
        return [g for g in games if g.home.id in teams or g.away.id in teams]

    async def _async_update_data(self) -> dict[int, TeamGames]:
        competitions = list(self.config_entry.data.get("competitions", []))
        errors: dict[str, RugbyPassError] = {}
        for slug in competitions:
            try:
                games = await self.client.fetch_competition(slug)
            except RugbyPassError as err:
                errors[slug] = err
                self._competition_failures[slug] = (
                    self._competition_failures.get(slug, 0) + 1
                )
                _LOGGER.warning(
                    "Fetch of %s failed (%s in a row), keeping its last games: %s",
                    slug,
                    self._competition_failures[slug],
                    err,
                )
            else:
                self._competition_games[slug] = games
                self._competition_failures[slug] = 0

        now = dt_util.utcnow()
        # Only for competitions that answered: a site outage is not retried
        # here, and their tables are fetched once they are back.
        await self._refresh_standings(
            [s for s in competitions if s not in errors], now
        )
        if competitions and len(errors) == len(competitions):
            self._failures += 1
            self.update_interval = retry_interval(
                self._failures, compute_interval(self._followed(self.games), now)
            )
            err = next(iter(errors.values()))
            if self.data is None or self._failures >= MAX_CONSECUTIVE_FAILURES:
                raise UpdateFailed(str(err)) from err
            _LOGGER.warning(
                "All fetches failed (%s/%s), keeping last data",
                self._failures,
                MAX_CONSECUTIVE_FAILURES,
            )
            return self.data
        self._failures = 0

        self.games = merge_games(
            *(
                self._competition_games[s]
                for s in competitions
                if s in self._competition_games
            )
        )
        computed = compute_interval(self._followed(self.games), now)
        if errors:
            worst = max(self._competition_failures[s] for s in errors)
            self.update_interval = retry_interval(worst, computed)
            for slug, err in errors.items():
                if (
                    self._competition_failures[slug] >= MAX_CONSECUTIVE_FAILURES
                    and slug not in self._competition_games
                ):
                    raise UpdateFailed(f"{slug}: {err}") from err
        else:
            self.update_interval = computed

        teams = entry_teams(self.config_entry)
        return {t: select_team_games(self.games, t, now) for t in teams}
