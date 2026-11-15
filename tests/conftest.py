"""Shared test fixtures."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable loading of custom integrations in all tests."""
    yield


@pytest.fixture(autouse=True)
def frontend(hass):
    """Stub the http/frontend dependencies; yield (register_static, add_js)."""
    register = AsyncMock()
    hass.http = MagicMock()
    hass.http.async_register_static_paths = register
    with (
        patch("homeassistant.components.http.async_setup", return_value=True),
        patch("homeassistant.components.frontend.async_setup", return_value=True),
        patch("custom_components.rugbypass.add_extra_js_url") as add_js,
    ):
        yield register, add_js
