"""HTTP client for the RugbyPass fixtures pages."""

from __future__ import annotations

import asyncio

import aiohttp

from .const import USER_AGENT
from .models import Game
from .source import ParseError, parse_games

BASE_URL = "https://www.rugbypass.com"
REQUEST_TIMEOUT = 15

# slug -> title; slugs verified to return 200 on the live site.
COMPETITIONS: dict[str, str] = {
    "united-rugby-championship": "United Rugby Championship",
    "top-14": "Top 14",
    "six-nations": "Six Nations",
    "rugby-world-cup": "Rugby World Cup",
    "premiership": "Gallagher Premiership",
    "the-rugby-championship": "The Rugby Championship",
    "super-rugby": "Super Rugby Pacific",
    "internationals": "Internationals",
}


class RugbyPassError(Exception):
    """Raised when fixtures cannot be fetched or understood."""


class RugbyPassClient:
    """Fetches and parses competition fixtures from RugbyPass."""

    def __init__(self, session: aiohttp.ClientSession) -> None:
        self._session = session

    def list_competitions(self) -> dict[str, str]:
        """Return the competitions offered by the integration (slug -> title)."""
        return dict(COMPETITIONS)

    async def fetch_competition(self, slug: str) -> list[Game]:
        """Fetch all games for a competition."""
        url = f"{BASE_URL}/{slug}/fixtures-results/"
        try:
            async with asyncio.timeout(REQUEST_TIMEOUT):
                async with self._session.get(
                    url, headers={"User-Agent": USER_AGENT}
                ) as resp:
                    if resp.status != 200:
                        raise RugbyPassError(f"{url} returned HTTP {resp.status}")
                    page = await resp.text()
        except TimeoutError as err:
            raise RugbyPassError(f"Timed out fetching {url}") from err
        except aiohttp.ClientError as err:
            raise RugbyPassError(f"Error fetching {url}: {err}") from err
        try:
            return parse_games(page)
        except ParseError as err:
            raise RugbyPassError(f"Unexpected page format at {url}: {err}") from err
