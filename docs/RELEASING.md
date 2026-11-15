# Releasing and verifying

> **Status as of this commit (delete once released):** v0.1.0 has NOT been tagged or released, `release.yml` has never run, and nothing has been installed on a Home Assistant instance yet. The steps below are still to do.

Releases are cut by pushing a `v*` tag; `.github/workflows/release.yml` checks the tag against the manifest version, runs the tests and publishes a GitHub release containing `rugbypass.zip` (the contents of `custom_components/rugbypass`).

The `rugbypass.zip` asset is a convenience download only. HACS installs from the repository at the tag (`hacs.json` has no `zip_release`).

## Steps

1. Make sure `main` is green (CI: tests, card, hacs, hassfest).
2. Check `custom_components/rugbypass/manifest.json` `version` matches the tag you are about to create (currently `0.1.0`); bump it first if not.
3. Tag and push: `git tag v0.1.0 && git push origin v0.1.0`.
4. Confirm the Release workflow succeeded and the release has `rugbypass.zip`.
5. In Home Assistant, HACS > Custom repositories > add `https://github.com/craibo/ha-rugby-pass` as type Integration, download it, restart HA, then add the RugbyPass integration.

## Live verification (not yet done)

The parser was written when the RugbyPass page had no live game, so live handling is an assumption. During a real match involving a followed team:

- Confirm the Current game sensor changes from "No game in progress" to a period and that the card shows the score and a period/minute badge, updating about every 60 s.
- Check the real shape of the live game's `minute` and `status` fields (view the sensor attributes, or the inline JSON on the fixtures page) and fix `parse_games` in `custom_components/rugbypass/source.py` if they differ (for example a different `status` text). A string `minute` such as "40+2" is already read as 40, and a non-numeric one such as "HT" as 0.
- Check the real half-time minute. If the game is still "First Half" past minute 40 or flips early, tune `HALF_TIME_MINUTE` in `custom_components/rugbypass/models.py`.
- Check the update interval drops back to 15 min / 6 h once the game ends.

If anything needs changing, add a saved HTML fixture of the live page to the tests, then release a new patch version.
