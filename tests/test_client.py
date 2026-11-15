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
URL = "https://www.rugbypass.com/united-rugby-championship/fixtures-results/"


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
