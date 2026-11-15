"""Tests for the RugbyPass HTTP client."""

import asyncio
from pathlib import Path

import aiohttp
from aioresponses import aioresponses
import pytest

from custom_components.rugbypass.client import (
    COMPETITIONS,
    RugbyPassClient,
    RugbyPassError,
)
from custom_components.rugbypass.const import USER_AGENT
from custom_components.rugbypass.source import GameSource

FIXTURE = Path(__file__).parent / "fixtures" / "urc_fixtures.html"
STANDINGS = Path(__file__).parent / "fixtures" / "urc_standings.html"
STANDINGS_URL = "https://www.rugbypass.com/united-rugby-championship/standings/"
URL = "https://www.rugbypass.com/united-rugby-championship/fixtures-results/"


@pytest.fixture(autouse=True)
def no_standings():
    """Override the conftest stub: these tests exercise the real fetch."""
    yield


@pytest.fixture(name="mocked")
def mocked_fixture():
    with aioresponses() as m:
        yield m


async def test_fetch_returns_games(mocked):
    mocked.get(URL, status=200, body=FIXTURE.read_text(encoding="utf-8"))
    async with aiohttp.ClientSession() as session:
        client = RugbyPassClient(session)
        assert isinstance(client, GameSource)
        games = await client.fetch_competition("united-rugby-championship")
    assert len(games) == 14


async def test_server_error_raises(mocked):
    mocked.get(URL, status=500)
    async with aiohttp.ClientSession() as session:
        with pytest.raises(RugbyPassError):
            await RugbyPassClient(session).fetch_competition(
                "united-rugby-championship"
            )


async def test_sends_user_agent(mocked):
    mocked.get(URL, status=200, body=FIXTURE.read_text(encoding="utf-8"))
    async with aiohttp.ClientSession() as session:
        await RugbyPassClient(session).fetch_competition("united-rugby-championship")
    (call,) = next(iter(mocked.requests.values()))
    assert call.kwargs["headers"]["User-Agent"] == USER_AGENT


async def test_timeout_raises(mocked):
    mocked.get(URL, exception=asyncio.TimeoutError())
    async with aiohttp.ClientSession() as session:
        with pytest.raises(RugbyPassError):
            await RugbyPassClient(session).fetch_competition(
                "united-rugby-championship"
            )


async def test_connection_error_raises(mocked):
    mocked.get(URL, exception=aiohttp.ClientConnectionError("boom"))
    async with aiohttp.ClientSession() as session:
        with pytest.raises(RugbyPassError):
            await RugbyPassClient(session).fetch_competition(
                "united-rugby-championship"
            )


async def test_unparseable_page_raises_client_error(mocked):
    mocked.get(URL, status=200, body="<html>nothing here</html>")
    async with aiohttp.ClientSession() as session:
        with pytest.raises(RugbyPassError):
            await RugbyPassClient(session).fetch_competition(
                "united-rugby-championship"
            )


async def test_list_competitions():
    async with aiohttp.ClientSession() as session:
        comps = RugbyPassClient(session).list_competitions()
    assert comps == COMPETITIONS
    assert comps["united-rugby-championship"] == "United Rugby Championship"


def test_competitions_slugs():
    assert set(COMPETITIONS) == {
        "united-rugby-championship",
        "top-14",
        "six-nations",
        "rugby-world-cup",
        "premiership",
        "the-rugby-championship",
        "super-rugby",
        "nations-championship",
        "internationals",
    }


# --- standings ------------------------------------------------------------------


async def test_fetch_standings_returns_positions(mocked):
    mocked.get(STANDINGS_URL, status=200, body=STANDINGS.read_text(encoding="utf-8"))
    async with aiohttp.ClientSession() as session:
        table = await RugbyPassClient(session).fetch_standings(
            "united-rugby-championship"
        )
    assert len(table) == 16
    assert table[3098] == 1
    (call,) = next(iter(mocked.requests.values()))
    assert call.kwargs["headers"]["User-Agent"] == USER_AGENT


@pytest.mark.parametrize(
    "kwargs",
    [
        {"status": 500},
        {"status": 403},
        {"exception": asyncio.TimeoutError()},
        {"exception": aiohttp.ClientConnectionError("boom")},
        {"status": 200, "body": "<html>nothing here</html>"},
    ],
)
async def test_fetch_standings_errors_raise(mocked, kwargs):
    mocked.get(STANDINGS_URL, **kwargs)
    async with aiohttp.ClientSession() as session:
        with pytest.raises(RugbyPassError) as info:
            await RugbyPassClient(session).fetch_standings("united-rugby-championship")
    if "exception" in kwargs or kwargs.get("status") == 200:
        assert info.value.__cause__ is not None


async def test_fetch_standings_404_means_no_standings_page(mocked):
    # e.g. Internationals: no standings page at all, which is not an error.
    mocked.get(STANDINGS_URL, status=404, body="<html>Not found</html>")
    async with aiohttp.ClientSession() as session:
        table = await RugbyPassClient(session).fetch_standings(
            "united-rugby-championship"
        )
    assert table == {}


async def test_fetch_competition_404_still_raises(mocked):
    mocked.get(URL, status=404)
    async with aiohttp.ClientSession() as session:
        with pytest.raises(RugbyPassError):
            await RugbyPassClient(session).fetch_competition(
                "united-rugby-championship"
            )


async def test_nations_championship_listed():
    async with aiohttp.ClientSession() as session:
        comps = RugbyPassClient(session).list_competitions()
    assert len(comps) == 9
    assert comps["nations-championship"] == "Nations Championship"


async def test_pool_standings_page_gives_no_ranks(mocked):
    # The Nations Championship standings page is pool-based: no ranks.
    url = "https://www.rugbypass.com/nations-championship/standings/"
    pool = Path(__file__).parent / "fixtures" / "pool_standings.html"
    mocked.get(url, status=200, body=pool.read_text(encoding="utf-8"))
    async with aiohttp.ClientSession() as session:
        table = await RugbyPassClient(session).fetch_standings("nations-championship")
    assert table == {}
