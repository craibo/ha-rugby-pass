"""Tests for the RugbyPass fixtures page parser."""

from datetime import UTC, datetime
from pathlib import Path

import pytest

from custom_components.rugbypass.const import PERIODS
from custom_components.rugbypass.models import Game, derive_period
from custom_components.rugbypass.source import GameSource, ParseError, parse_games

FIXTURE = Path(__file__).parent / "fixtures" / "urc_fixtures.html"

CARDIFF_ID = 4471
SECOND_HALF = PERIODS[2]


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
    with pytest.raises(ParseError, match="malformed or truncated"):
        parse_games(html)


def test_game_source_is_protocol():
    class Fake:
        async def fetch_competition(self, slug: str) -> list[Game]:
            return []

    source: GameSource = Fake()
    assert isinstance(source, GameSource)


def _fixture_html() -> str:
    return FIXTURE.read_text(encoding="utf-8")


def test_live_game():
    # Assumed live shape (no live game on the real page yet).
    html = _fixture_html()
    old = '"homeScore":0,"awayScore":0,"round":"Round 6"'
    start = html.index('{"id":292628,')
    end = html.index('"date":', start)
    game_json = html[start:end]
    assert old in game_json
    live_json = (
        game_json.replace(old, '"homeScore":17,"awayScore":10,"round":"Round 6"')
        .replace(
            '"status":"fixture","upcoming":true,"live":false',
            '"status":"live","upcoming":false,"live":true',
        )
        .replace('"minute":0,', '"minute":63,')
    )
    assert live_json != game_json
    game = by_id(parse_games(html.replace(game_json, live_json)), 292628)
    assert game.live is True
    assert game.home_score == 17
    assert game.away_score == 10
    assert game.minute == 63
    assert derive_period(game) == SECOND_HALF


def test_missing_minute_is_zero():
    html = _fixture_html().replace('"minute":80,', "", 1)
    assert by_id(parse_games(html), 292585).minute == 0


def test_non_numeric_game_id_raises():
    html = _fixture_html().replace('"id":292585,', '"id":"abc",', 1)
    with pytest.raises(ParseError):
        parse_games(html)


def test_non_numeric_team_id_raises():
    html = _fixture_html().replace('"id":5483,', '"id":"connacht",', 1)
    with pytest.raises(ParseError):
        parse_games(html)


def test_games_present_but_none_mappable_raises():
    html = _fixture_html().replace('"homeTeam":', '"home":')
    with pytest.raises(ParseError):
        parse_games(html)


def test_empty_games_array_is_empty_list():
    html = (
        '<div id="current-game-days" style="display: none;">'
        '[{"epoch":1790361900,"title":"Sat 26 Sep, 2026","tournaments":'
        '[{"title":"United Rugby Championship","order":0,"games":[]}]}]</div>'
    )
    assert parse_games(html) == []


def test_html_entity_escaped_json():
    html = _fixture_html()
    start = html.index(">", html.index('id="current-game-days"')) + 1
    end = html.index("</div>", start)
    escaped = html[:start] + html[start:end].replace('"', "&quot;") + html[end:]
    assert len(parse_games(escaped)) == 14


def test_non_array_json_raises():
    html = '<div id="current-game-days" style="display: none;">{"a":1}</div>'
    with pytest.raises(ParseError, match="not a JSON array"):
        parse_games(html)


@pytest.mark.parametrize(
    ("raw", "expected"),
    [('"45+2"', 45), ('"HT"', 0), ('""', 0), ("null", 0), ("63", 63), ('"63"', 63)],
)
def test_live_minute_never_fails_the_page(raw, expected):
    html = _fixture_html().replace('"minute":80,', f'"minute":{raw},', 1)
    assert by_id(parse_games(html), 292585).minute == expected


def test_minute_helper_direct():
    from custom_components.rugbypass.source import _minute

    assert _minute("45+2") == 45
    assert _minute("HT") == 0
    assert _minute(None) == 0
    assert _minute(52) == 52
