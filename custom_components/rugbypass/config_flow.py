"""Config flow and options flow for RugbyPass."""

from __future__ import annotations

from typing import Any

import voluptuous as vol
from homeassistant.config_entries import ConfigFlow, ConfigFlowResult, OptionsFlow
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.selector import (
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
)

from .client import RugbyPassClient, RugbyPassError
from .const import DOMAIN
from .coordinator import RugbyPassConfigEntry


async def _fetch_team_options(
    hass: HomeAssistant, competitions: list[str]
) -> tuple[list[SelectOptionDict], dict[str, str]]:
    """Fetch the teams of the competitions; return select options and id -> name.

    Raises RugbyPassError when a competition cannot be fetched.
    """
    client = RugbyPassClient(async_get_clientsession(hass))
    titles = client.list_competitions()
    names: dict[int, str] = {}
    where: dict[int, list[str]] = {}
    for slug in competitions:
        title = titles.get(slug, slug)
        for game in await client.fetch_competition(slug):
            for team in (game.home, game.away):
                names[team.id] = team.name
                comps = where.setdefault(team.id, [])
                if title not in comps:
                    comps.append(title)
    ordered = sorted(names, key=lambda i: (names[i].casefold(), i))
    options = [
        SelectOptionDict(
            value=str(i), label=f"{names[i]} ({', '.join(where[i])})"
        )
        for i in ordered
    ]
    return options, {str(i): names[i] for i in ordered}


def _select(options: list[SelectOptionDict]) -> SelectSelector:
    return SelectSelector(SelectSelectorConfig(options=options, multiple=True))


class RugbyPassConfigFlow(ConfigFlow, domain=DOMAIN):
    """Handle the RugbyPass config flow."""

    VERSION = 1

    def __init__(self) -> None:
        self._competitions: list[str] = []
        self._team_names: dict[str, str] = {}
        self._team_options: list[SelectOptionDict] = []

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: RugbyPassConfigEntry) -> OptionsFlow:
        return RugbyPassOptionsFlow()

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()

        errors: dict[str, str] = {}
        if user_input is not None:
            self._competitions = user_input["competitions"]
            try:
                self._team_options, self._team_names = await _fetch_team_options(
                    self.hass, self._competitions
                )
            except RugbyPassError:
                errors["base"] = "cannot_connect"
            else:
                if self._team_options:
                    return await self.async_step_teams()
                errors["base"] = "no_teams"

        titles = RugbyPassClient(async_get_clientsession(self.hass)).list_competitions()
        options = [SelectOptionDict(value=s, label=t) for s, t in titles.items()]
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(
                        "competitions", default=self._competitions
                    ): vol.All(_select(options), vol.Length(min=1))
                }
            ),
            errors=errors,
        )

    async def async_step_teams(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        if user_input is not None:
            ids = [int(t) for t in user_input["teams"]]
            return self.async_create_entry(
                title="RugbyPass",
                data={
                    "competitions": self._competitions,
                    "teams": ids,
                    "team_names": {
                        str(i): self._team_names[str(i)] for i in ids
                    },
                },
            )
        return self.async_show_form(
            step_id="teams",
            data_schema=vol.Schema(
                {
                    vol.Required("teams"): vol.All(
                        _select(self._team_options), vol.Length(min=1)
                    )
                }
            ),
        )


class RugbyPassOptionsFlow(OptionsFlow):
    """Edit the followed teams."""

    def __init__(self) -> None:
        # Names of the teams offered when the form was shown.
        self._team_names: dict[str, str] = {}

    async def async_step_init(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        entry = self.config_entry
        stored = {
            **entry.data.get("team_names", {}),
            **entry.options.get("team_names", {}),
        }

        if user_input is not None:
            # No refetch: submitting must work even while RugbyPass is down.
            ids = [int(t) for t in user_input["teams"]]
            known = {**stored, **self._team_names}
            return self.async_create_entry(
                data={
                    "teams": ids,
                    "team_names": {
                        str(i): known[str(i)] for i in ids if str(i) in known
                    },
                }
            )

        errors: dict[str, str] = {}
        options: list[SelectOptionDict] = []
        try:
            options, self._team_names = await _fetch_team_options(
                self.hass, list(entry.data["competitions"])
            )
        except RugbyPassError:
            # Still offer the followed teams (stored names) so they can be
            # unfollowed while RugbyPass is unreachable.
            errors["base"] = "cannot_connect"

        current = [
            str(t) for t in entry.options.get("teams", entry.data["teams"])
        ]
        # Keep currently followed teams selectable even if absent from the fetch.
        have = {o["value"] for o in options}
        for t in current:
            if t not in have:
                options.append(SelectOptionDict(value=t, label=stored.get(t, t)))
        return self.async_show_form(
            step_id="init",
            data_schema=vol.Schema(
                {
                    vol.Required("teams", default=current): vol.All(
                        _select(options), vol.Length(min=1)
                    )
                }
            ),
            errors=errors,
        )
