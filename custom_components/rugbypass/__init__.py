"""The RugbyPass integration."""

from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession

from .client import RugbyPassClient
from .coordinator import RugbyPassConfigEntry, RugbyPassCoordinator


async def async_setup_entry(hass: HomeAssistant, entry: RugbyPassConfigEntry) -> bool:
    """Set up RugbyPass from a config entry."""
    client = RugbyPassClient(async_get_clientsession(hass))
    coordinator = RugbyPassCoordinator(hass, entry, client)
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator
    entry.async_on_unload(entry.add_update_listener(_async_reload))
    return True


async def _async_reload(hass: HomeAssistant, entry: RugbyPassConfigEntry) -> None:
    """Reload the entry when options change."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: RugbyPassConfigEntry) -> bool:
    """Unload a config entry."""
    return True
