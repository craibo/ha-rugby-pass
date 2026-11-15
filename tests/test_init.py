"""Scaffold tests."""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent


def test_manifest_domain():
    manifest = json.loads(
        (ROOT / "custom_components" / "rugbypass" / "manifest.json").read_text()
    )
    assert manifest["domain"] == "rugbypass"
    assert json.loads((ROOT / "hacs.json").read_text())
