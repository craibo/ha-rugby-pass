"""HTTP client for the RugbyPass fixtures pages."""

from __future__ import annotations

import asyncio

import aiohttp

from .const import USER_AGENT
from .models import Game
from .source import ParseError, parse_games, parse_standings

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
    "nations-championship": "Nations Championship",
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
        page = await self._get(url)
        assert page is not None
        try:
            return parse_games(page)
        except ParseError as err:
            raise RugbyPassError(f"Unexpected page format at {url}: {err}") from err

    async def fetch_standings(self, slug: str) -> dict[int, int]:
        """Fetch a competition's league table (team id -> position).

        Empty when the competition has no standings page (HTTP 404, e.g.
        Internationals) and for pool/conference tables. Any other failure
        (other HTTP errors, timeouts, connection errors, an unexpected page)
        raises ``RugbyPassError``.
        """
        url = f"{BASE_URL}/{slug}/standings/"
        page = await self._get(url, missing_ok=True)
        if page is None:
            return {}
        try:
            return parse_standings(page)
        except ParseError as err:
            raise RugbyPassError(f"Unexpected page format at {url}: {err}") from err

    async def _get(self, url: str, *, missing_ok: bool = False) -> str | None:
        """GET a page as text; any failure is a ``RugbyPassError``.

        With ``missing_ok``, HTTP 404 returns None instead of raising.
        """
        try:
            async with asyncio.timeout(REQUEST_TIMEOUT):
                async with self._session.get(
                    url, headers={"User-Agent": USER_AGENT}
                ) as resp:
                    if missing_ok and resp.status == 404:
                        return None
                    if resp.status != 200:
                        raise RugbyPassError(f"{url} returned HTTP {resp.status}")
                    return await resp.text()
        except TimeoutError as err:
            raise RugbyPassError(f"Timed out fetching {url}") from err
        except aiohttp.ClientError as err:
            raise RugbyPassError(f"Error fetching {url}: {err}") from err
