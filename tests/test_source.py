"""Tests for the RugbyPass fixtures page parser."""

from datetime import UTC, datetime
from pathlib import Path

import pytest

from custom_components.rugbypass.models import Game
from custom_components.rugbypass.source import GameSource, ParseError, parse_games

FIXTURE = Path(__file__).parent / "fixtures" / "urc_fixtures.html"

CARDIFF_ID = 4471


@pytest.fixture(name="games")
def games_fixture() -> list[Game]:
    return parse_games(FIXTURE.read_text(encoding="utf-8"))


def by_id(games: list[Game], game_id: int) -> Game:
    return next(g for g in games if g.id == game_id)


def test_game_count(games):
    # 14 games with teams; the team-less finals placeholders are not games.
    assert len(games) == 14
    assert len({g.id for g in games}) == 14


def test_played_game(games):
    game = by_id(games, 292585)
    assert game.home.id == 5483
    assert game.home.name == "Connacht"
    assert game.home.slug == "connacht"
    assert game.home.logo.startswith("https://eu-cdn.rugbypass.com/")
    assert game.away.id == 3994
    assert game.away.name == "Stormers"
    assert game.home_score == 15
    assert game.away_score == 29
    assert game.kickoff == datetime(2026, 9, 25, 18, 45, tzinfo=UTC)
    assert game.kickoff.utcoffset().total_seconds() == 0
    assert game.venue == "Dexcom Stadium"
    assert game.competition == "United Rugby Championship"
    assert game.status == "result"
    assert game.live is False
    assert game.minute == 80
    assert game.url == "https://www.rugbypass.com/live/connacht-vs-stormers/?g=292585"


def test_played_game_zero_score_kept(games):
    game = by_id(games, 292623)  # Ospreys 0 - 26 Cardiff Rugby
    assert game.home_score == 0
    assert game.away_score == 26


def test_upcoming_game_has_no_scores(games):
    game = by_id(games, 292628)
    assert game.status == "fixture"
    assert game.home_score is None
    assert game.away_score is None
    assert game.kickoff == datetime(2026, 12, 5, 15, 0, tzinfo=UTC)


def test_cardiff_slug(games):
    cardiff = {
        t for g in games for t in (g.home, g.away) if t.name == "Cardiff Rugby"
    }
    assert len(cardiff) == 1
    team = cardiff.pop()
    assert team.id == CARDIFF_ID
    assert team.slug == "cardiff-blues"


def test_postponed_status(games):
    assert by_id(games, 292633).status == "postponed"


def test_canceled_status(games):
    assert by_id(games, 292634).status == "canceled"


def test_missing_scores_are_none():
    html = FIXTURE.read_text(encoding="utf-8")
    html = html.replace('"homeScore":15,"awayScore":29,', "", 1)
    game = by_id(parse_games(html), 292585)
    assert game.home_score is None
    assert game.away_score is None


def test_no_inline_json_raises():
    with pytest.raises(ParseError):
        parse_games("<html><body><p>Nothing here</p></body></html>")


def test_malformed_inline_json_raises():
    html = '<div id="current-game-days" style="display: none;">[{"epoch":</div>'
    with pytest.raises(ParseError):
        parse_games(html)


def test_game_source_is_protocol():
    class Fake:
        async def fetch_competition(self, slug: str) -> list[Game]:
            return []

    source: GameSource = Fake()
    assert isinstance(source, GameSource)
