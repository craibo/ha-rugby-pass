"""Pure selection of current/next/previous games for a team."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from .models import Game

MAX_PREVIOUS = 5
_EXCLUDED = ("postponed", "canceled")


@dataclass
class TeamGames:
    """Games of interest for one team."""

    current: Game | None
    next: Game | None
    previous: list[Game]


def _is_played(game: Game) -> bool:
    return game.status == "result" and not game.live


def select_team_games(games: list[Game], team_id: int, now: datetime) -> TeamGames:
    """Pick the current, next and previous games for a team id."""
    mine = [g for g in games if team_id in (g.home.id, g.away.id)]

    live = [g for g in mine if g.live and g.status not in _EXCLUDED]
    started = [g for g in live if g.kickoff <= now]
    # Clock-skew fallback: a live game with a future kickoff still counts.
    if started:
        current = max(started, key=lambda g: g.kickoff)
    elif live:
        current = min(live, key=lambda g: g.kickoff)
    else:
        current = None

    upcoming = [
        g
        for g in mine
        if g.kickoff > now
        and g.status not in _EXCLUDED
        and not g.live
        and not _is_played(g)
    ]
    nxt = min(upcoming, key=lambda g: g.kickoff, default=None)

    played = sorted((g for g in mine if _is_played(g)), key=lambda g: g.kickoff, reverse=True)
    return TeamGames(current, nxt, played[:MAX_PREVIOUS])


def merge_games(*lists: list[Game]) -> list[Game]:
    """Merge game lists, deduping by id with stable order."""
    merged: dict[int, Game] = {}
    for games in lists:
        for game in games:
            existing = merged.get(game.id)
            if existing is None:
                merged[game.id] = game
            elif (game.live or _is_played(game)) and not (
                existing.live or _is_played(existing)
            ):
                merged[game.id] = game
    return list(merged.values())
