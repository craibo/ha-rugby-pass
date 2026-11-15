"""Tests for the RugbyPass fixtures page parser."""

from datetime import UTC, datetime
from pathlib import Path

import pytest

from custom_components.rugbypass.const import PERIODS
from custom_components.rugbypass.models import Game, derive_period
from custom_components.rugbypass.source import (
    GameSource,
    ParseError,
    parse_games,
    parse_standings,
    parse_world_rankings,
)

FIXTURES = Path(__file__).parent / "fixtures"
FIXTURE = FIXTURES / "urc_fixtures.html"
STANDINGS = FIXTURES / "urc_standings.html"
POOL_STANDINGS = FIXTURES / "pool_standings.html"
NO_STANDINGS = FIXTURES / "no_standings.html"
WORLD_RANKINGS = FIXTURES / "world_rankings.html"
NO_WORLD_RANKINGS = FIXTURES / "no_world_rankings.html"

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


def test_competition_slug_from_tournament_uri(games):
    assert {g.competition_slug for g in games} == {"united-rugby-championship"}


def test_missing_tournament_uri_is_empty_slug():
    html = _fixture_html().replace(
        '"tournamentUri":"united-rugby-championship",', "", 1
    )
    slugs = [g.competition_slug for g in parse_games(html)]
    assert slugs.count("") == 1


# --- standings ------------------------------------------------------------------


def _standings_html() -> str:
    return STANDINGS.read_text(encoding="utf-8")


def test_parse_standings_all_teams():
    table = parse_standings(_standings_html())
    assert len(table) == 16
    assert table[3098] == 1  # Glasgow
    assert table[4471] == 7  # Cardiff
    assert table[5483] == 11  # Connacht
    assert table[4474] == 16  # Zebre
    assert sorted(table.values()) == list(range(1, 17))


def test_parse_standings_pool_page_is_empty():
    assert parse_standings(POOL_STANDINGS.read_text(encoding="utf-8")) == {}


def test_parse_standings_groups_without_conference_flag_is_empty():
    html = _standings_html().replace('"groups":[]', '"groups":[{"name":"Pool A"}]', 1)
    assert parse_standings(html) == {}


def test_parse_standings_conference_flag_is_empty():
    html = _standings_html().replace(
        '"standingsConference":false', '"standingsConference":true', 1
    )
    assert parse_standings(html) == {}


def test_parse_standings_has_standings_false_is_empty():
    html = _standings_html().replace('"hasStandings":true', '"hasStandings":false', 1)
    assert parse_standings(html) == {}


def test_parse_standings_missing_element_raises():
    with pytest.raises(ParseError):
        parse_standings(NO_STANDINGS.read_text(encoding="utf-8"))


def test_parse_standings_malformed_json_raises():
    html = '<div id="standings-data" style="display: none;">{"hasStandings":</div>'
    with pytest.raises(ParseError):
        parse_standings(html)


def test_parse_standings_non_object_json_raises():
    html = '<div id="standings-data" style="display: none;">[1, 2]</div>'
    with pytest.raises(ParseError):
        parse_standings(html)


def test_parse_standings_skips_bad_entries():
    html = (
        _standings_html()
        .replace('"team":{"id":3098,', '"team":{"id":"gla",', 1)
        .replace('"position":7,', '"position":null,', 1)
    )
    table = parse_standings(html)
    assert 3098 not in table
    assert 4471 not in table
    assert len(table) == 14
    assert table[5586] == 2


def test_parse_standings_html_entity_escaped():
    html = _standings_html()
    start = html.index(">", html.index('id="standings-data"')) + 1
    end = html.index("</div>", start)
    escaped = html[:start] + html[start:end].replace('"', "&quot;") + html[end:]
    assert len(parse_standings(escaped)) == 16


@pytest.mark.parametrize(
    "bad_id",
    ['"²"', '"١٢"', '"' + "9" * 5000 + '"', "9" * 20, '"1234567890"', "1.5", "true"],
    ids=["superscript", "arabic-indic", "5000-digit-string", "20-digit-int",
         "10-digit-string", "float", "bool"],
)  # fmt: skip
def test_parse_standings_skips_unusable_ids(bad_id):
    html = _standings_html().replace('"team":{"id":3098,', f'"team":{{"id":{bad_id},', 1)
    table = parse_standings(html)
    assert 3098 not in table
    assert len(table) == 15


def test_parse_standings_accepts_digit_string_ids():
    html = _standings_html().replace('"team":{"id":3098,', '"team":{"id":" 3098 ",', 1)
    assert parse_standings(html)[3098] == 1


def test_parse_standings_deeply_nested_json_raises_parse_error():
    deep = "[" * 100_000 + "]" * 100_000
    html = (
        '<div id="standings-data" style="display: none;">'
        '{"hasStandings":true,"x":' + deep + "}</div>"
    )
    with pytest.raises(ParseError):
        parse_standings(html)


@pytest.mark.parametrize("position", ["0", "-3", '"0"'], ids=["zero", "negative", "zero-str"])
def test_parse_standings_drops_positions_below_one(position):
    html = _standings_html().replace('"position":7,', f'"position":{position},', 1)
    table = parse_standings(html)
    assert 4471 not in table
    assert len(table) == 15


def test_parse_standings_duplicate_team_keeps_first():
    # Make Zebre (16th) a second Glasgow entry: the first (1st) wins.
    html = _standings_html().replace('"team":{"id":4474,', '"team":{"id":3098,', 1)
    table = parse_standings(html)
    assert table[3098] == 1
    assert len(table) == 15


def test_parse_standings_huge_raw_int_raises_parse_error():
    # Python refuses to decode ints over 4300 digits (ValueError): the page
    # is unusable, which must surface as ParseError, never ValueError.
    html = _standings_html().replace('"team":{"id":3098,', '"team":{"id":' + "9" * 5000 + ",", 1)
    with pytest.raises(ParseError):
        parse_standings(html)


# --- world rankings ---------------------------------------------------------------


def _rankings_html() -> str:
    return WORLD_RANKINGS.read_text(encoding="utf-8")


def _entry(p, u, n="X"):
    return {"p": p, "n": n, "m": 0, "d": 0, "u": u, "l": "", "pts": 50.0}


def _rankings_page(entries, before="", after=""):
    import json as _json

    return (
        "<script> createApp({ data() { return { type:\"bars\", "
        + before
        + "rankings:"
        + _json.dumps(entries)
        + ", "
        + after
        + "} } }); </script>"
    )


def test_parse_world_rankings_fixture():
    table = parse_world_rankings(_rankings_html())
    assert len(table) == 25
    assert table["south-africa"] == 1
    assert table["new-zealand"] == 2
    assert table["ireland"] == 3
    assert table["france"] == 4
    assert table["england"] == 5
    assert table["scotland"] == 6
    assert table["spain"] == 16
    assert sorted(table.values()) == list(range(1, 26))


def test_parse_world_rankings_not_confused_by_movers_or_other_keys():
    # movers (same entry shape) and rankingsList come BEFORE rankings here.
    movers = [_entry(16, "spain"), _entry(17, "tonga")]
    page = _rankings_page(
        [_entry(1, "south-africa"), _entry(2, "new-zealand")],
        before="movers:"
        + __import__("json").dumps(movers)
        + ", rankingsList:[], myRankings:[], rankingsLabel:\"9 Nov 2026\", ",
    )
    page = "<h2>World Rankings: All eyes on Paris</h2>" + page
    assert parse_world_rankings(page) == {"south-africa": 1, "new-zealand": 2}


def test_parse_world_rankings_skips_rankings_array_of_other_shape():
    page = (
        "<script>var a = { rankings:[{\"x\":1}] };</script>"
        + _rankings_page([_entry(1, "fiji")])
    )
    assert parse_world_rankings(page) == {"fiji": 1}


def test_parse_world_rankings_missing_array_raises():
    with pytest.raises(ParseError):
        parse_world_rankings(NO_WORLD_RANKINGS.read_text(encoding="utf-8"))
    with pytest.raises(ParseError):
        parse_world_rankings("<html><body>nothing</body></html>")


def test_parse_world_rankings_malformed_raises():
    with pytest.raises(ParseError):
        parse_world_rankings('<script>x = { rankings:[{"p":1,"n":"A","u":"a",')


def test_parse_world_rankings_deeply_nested_raises_parse_error():
    deep = "[" * 100_000 + "]" * 100_000
    with pytest.raises(ParseError):
        parse_world_rankings("<script>x = { rankings:[" + deep + "] }</script>")


def test_parse_world_rankings_huge_raw_int_raises_parse_error():
    page = '<script>x = { rankings:[{"p":' + "9" * 5000 + ',"n":"A","u":"a","pts":1}] }'
    with pytest.raises(ParseError):
        parse_world_rankings(page)


@pytest.mark.parametrize(
    "bad",
    [
        {"p": "²", "u": "a"},
        {"p": "١٢", "u": "a"},
        {"p": "9" * 5000, "u": "a"},
        {"p": 10**12, "u": "a"},
        {"p": 0, "u": "a"},
        {"p": -1, "u": "a"},
        {"p": 1.5, "u": "a"},
        {"p": True, "u": "a"},
        {"p": None, "u": "a"},
        {"p": 3, "u": ""},
        {"p": 3, "u": "   "},
        {"p": 3, "u": 7},
        {"p": 3},
        "not-a-dict",
    ],
    ids=["superscript", "arabic-indic", "5000-digit-str", "huge-int", "zero",
         "negative", "float", "bool", "null", "empty-slug", "blank-slug",
         "int-slug", "no-slug", "string-entry"],
)  # fmt: skip
def test_parse_world_rankings_skips_bad_entries(bad):
    if isinstance(bad, dict):
        bad = {"n": "Bad", "pts": 1.0, **bad}
    page = _rankings_page([_entry(1, "south-africa"), bad, _entry(2, "new-zealand")])
    assert parse_world_rankings(page) == {"south-africa": 1, "new-zealand": 2}


def test_parse_world_rankings_digit_string_position_ok():
    page = _rankings_page([{"p": " 4 ", "n": "France", "u": "france", "pts": 1}])
    assert parse_world_rankings(page) == {"france": 4}


def test_parse_world_rankings_duplicate_slug_keeps_first():
    page = _rankings_page([_entry(1, "fiji"), _entry(9, "fiji"), _entry(2, "tonga")])
    assert parse_world_rankings(page) == {"fiji": 1, "tonga": 2}


def test_parse_world_rankings_html_entity_escaped():
    html = _rankings_html().replace('"', "&quot;")
    assert len(parse_world_rankings(html)) == 25
