# Releasing and verifying

> **Status:** releases through v0.4.0 were published under the old name (`ha-rugby-pass`, domain `rugbypass`). The first release under the new name will be v0.5.0, a breaking change because the integration domain changed to `rugby_team_tracker` (see the upgrade section in the README). Rename the GitHub repository first: see [RENAMING_THE_REPOSITORY.md](RENAMING_THE_REPOSITORY.md).

Releases are cut by pushing a `v*` tag; `.github/workflows/release.yml` checks the tag against the manifest version, runs the tests and publishes a GitHub release containing `rugby_team_tracker.zip` (the contents of `custom_components/rugby_team_tracker`).

The `rugby_team_tracker.zip` asset is a convenience download only. HACS installs from the repository at the tag (`hacs.json` has no `zip_release`).

## Steps

1. Make sure `main` is green (CI: tests, card, hacs, hassfest).
2. Check `custom_components/rugby_team_tracker/manifest.json` `version` matches the tag you are about to create (currently `0.5.1`); bump it first if not, and bump the version in `USER_AGENT` in `custom_components/rugby_team_tracker/const.py` together with it (a test fails if they differ).
3. Tag and push: `git tag v0.5.1 && git push origin v0.5.1`.
4. Confirm the Release workflow succeeded and the release has `rugby_team_tracker.zip`.
5. In Home Assistant, HACS > Custom repositories > add `https://github.com/craibo/ha-rugby-team-tracker` as type Integration, download it, restart HA, then add **Rugby Team Tracker**.

## Live verification (done on 2026-11-15)

A real match (Scotland v Australia, game id 291602) was sampled about every 2.5 minutes from 15:45 to 17:03 UTC. The game JSON has a text `status` that gives the period: `first half` (live, minute 25 to 39), then `halftime` (one word; live, minute frozen at 41 for the whole 13+ minute break), then `second half` (live; the minute restarts at 40, then 43 to 79), then `result` (live false, played true, minute 80, final score). Before kick-off the status is `fixture`; there is no separate full-time status. Scores can go down as well as up and are reported as the page shows them, and the match started later than scheduled, so the period is never inferred from the clock.

If the data source changes (new statuses, a different shape), sample a live page again, save a trimmed fixture under `tests/fixtures/` and adjust `derive_period` in `custom_components/rugby_team_tracker/models.py`; unknown live statuses fall back to the minute rule (`HALF_TIME_MINUTE`).
