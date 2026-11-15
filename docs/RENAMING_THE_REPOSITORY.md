# Renaming the GitHub repository

The project is now called **Rugby Team Tracker** and the repository should be renamed from `craibo/ha-rugby-pass` to `craibo/ha-rugby-team-tracker`. The repository owner does this on GitHub. Follow these steps in order so that references do not break.

1. **Merge the rename pull request first.** All links in it already use the new name; they resolve once step 2 is done.
2. **Rename the repository.** On GitHub open the repository > **Settings > General > Repository name**, enter `ha-rugby-team-tracker` and click **Rename**. GitHub then redirects the old web, git and API URLs to the new name. Never create another repository with the old name, or the redirect stops working.
3. **Update every local clone:**
   ```bash
   git remote set-url origin https://github.com/craibo/ha-rugby-team-tracker.git
   git remote -v
   ```
4. **HACS users:** must not update in place (that can leave both the old and new integration folders installed). They should remove the old integration entry in Home Assistant first, then the old HACS entry (or the old `custom_components/rugbypass` folder if installed manually), restart, add the new repository in HACS, install the new integration, re-add it and change any dashboard cards to the `rugby-tracker-*` card types.
5. **Tools and sessions** that hold a reference to the old repository name (CI integrations, bots, AI coding sessions attached to `craibo/ha-rugby-pass`) must be re-attached by the new name. Redirects usually keep working for a while, but do not rely on them.
6. **Tags and releases** move with the repository and their old download URLs redirect. Old releases still contain the old integration name and domain (`rugbypass`).
7. **Check the repository settings:** the description and topics are kept, but update the description if it names the old brand; also check branch protection, GitHub Pages and webhooks (if any), and the README badges.
8. **Publish v0.5.0** under the new name after the rename (see [RELEASING.md](RELEASING.md)).
