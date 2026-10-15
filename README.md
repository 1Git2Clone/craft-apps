# pages

Publishes the browser builds of the storytold apps mirrored in this org, each
on its own name: photocraft, cadcraft, effectcraft, filmcraft, figcraft,
gridcraft, deckcraft and wordcraft, at `<name>.hu-tao.dev`.

Nothing is built here. `.forgejo/workflows/pages.yml` fetches each app's
upstream `<name>-web-<version>.zip` release, checks it against that release's
`SHA256SUMS.txt` and uploads them together as the `pages` artifact. The
versions are pinned in that workflow; bump one there to publish a newer
release.

This is the only repo in the org with Actions on. The mirrors carry upstream's
`.github/workflows`, which Forgejo would otherwise run on every mirrored push.
