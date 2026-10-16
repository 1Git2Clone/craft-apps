# pages

[crafts.hu-tao.dev](https://crafts.hu-tao.dev): the browser builds of the
storytold apps mirrored in this org (photocraft, cadcraft, effectcraft,
filmcraft, figcraft, gridcraft, deckcraft and wordcraft) under one bar with an
app switcher. An unofficial host, not affiliated with ArtCraft.

A SvelteKit site, prerendered to static files. Each app gets a page at
`/<name>/` that frames upstream's own build from `/apps/<name>/`. The apps are
not built here: `pnpm fetch-apps` downloads each one's
`<name>-web-<version>.zip` release, checks it against that release's
`SHA256SUMS.txt` and unpacks it into `static/apps/<name>/`.

The versions are pinned in `sites.json`. Renovate opens a pull request for
each new upstream release; merging one republishes the site.

## Working on it

```sh
nix develop        # node, pnpm, curl and unzip
pnpm install
pnpm fetch-apps    # once, and after a version bump
pnpm dev
```

`pnpm check` runs the type check and Vite+'s lint and format check;
`pnpm format` formats. Oxfmt does not format `.svelte` files.

## Publishing

`.forgejo/workflows/pages.yml` runs on every push to `main`: install, fetch
the apps, build, and upload `build/` as the `pages` artifact, which the VPS
pulls and serves. See the handbook's Pages chapter in hutao/vps.

This is the only repo in the org with Actions on. The mirrors carry upstream's
`.github/workflows`, which Forgejo would otherwise run on every mirrored push.
