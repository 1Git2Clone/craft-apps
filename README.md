<div align="center">

# craft-apps

[![GitHub Pages](https://img.shields.io/github/actions/workflow/status/1Git2Clone/craft-apps/pages.yml?branch=main&style=for-the-badge&logo=githubactions&logoColor=white&label=GitHub%20Pages)](https://github.com/1Git2Clone/craft-apps/actions/workflows/pages.yml)
[![crafts.hu-tao.dev](https://img.shields.io/website?url=https%3A%2F%2Fcrafts.hu-tao.dev&style=for-the-badge&label=crafts.hu-tao.dev&up_message=live&up_color=31a8ff&logo=caddy)](https://crafts.hu-tao.dev)
[![github.io](https://img.shields.io/website?url=https%3A%2F%2F1git2clone.github.io%2Fcraft-apps%2F&style=for-the-badge&label=github.io&up_message=live&up_color=31a8ff&logo=github)](https://1git2clone.github.io/craft-apps/)

[![apps](https://img.shields.io/badge/apps-13-31a8ff?style=for-the-badge)](sites.json)
[![upstream licence](https://img.shields.io/badge/upstream_licence-MIT%20OR%20Apache--2.0-262626?style=for-the-badge)](https://github.com/storytold/photocraft/blob/main/LICENSE-MIT)
[![unofficial](https://img.shields.io/badge/unofficial-not%20affiliated%20with%20ArtCraft-555?style=for-the-badge)](#disclaimer)

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://svelte.dev/docs/kit)
[![Vite+](https://img.shields.io/badge/Vite%2B-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://viteplus.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Nix](https://img.shields.io/badge/Nix-5277C3?style=for-the-badge&logo=nixos&logoColor=white)](flake.nix)

</div>

The open-source [storytold](https://github.com/storytold) craft apps
(PhotoCraft, LightCraft, VectorCraft, DesignCraft, FigCraft, FilmCraft,
EffectCraft, SoundCraft, WordCraft, GridCraft, DeckCraft, PdfCraft and
CADCraft) in your browser, under one bar with an app switcher. Live at
[crafts.hu-tao.dev](https://crafts.hu-tao.dev).

## Disclaimer

**This is not an official ArtCraft site, and it is not affiliated with or
endorsed by ArtCraft or Storytold.** These are their open-source web builds,
served unmodified. Each app is licensed under MIT or Apache-2.0, at your
option; its source, licences and NOTICE are in its own
[storytold](https://github.com/storytold) repository.

## Host your own on GitHub Pages

1. Fork this repo.
2. In the fork: Settings → Pages → Build and deployment → Source:
   **GitHub Actions**.
3. Actions → Pages → Run workflow (or push anything to `main`).

The site appears at `https://<you>.github.io/<repo>/`. Nothing else is needed:
no server, no build tools on your machine. To keep the apps current, install
[Renovate](https://github.com/apps/renovate) on the fork, or bump the versions
in `sites.json` by hand.

Anywhere else that serves static files works too: run the steps below and
upload `build/`.

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

The same repo lives in two places, and each forge runs only its own workflow:

- **GitHub** ([1Git2Clone/craft-apps](https://github.com/1Git2Clone/craft-apps)):
  `.github/workflows/pages.yml` deploys to GitHub Pages.
- **Forgejo** (`craft-projects/pages` on git.hu-tao.dev):
  `.forgejo/workflows/pages.yml` uploads `build/` as the `pages` artifact,
  which the VPS behind crafts.hu-tao.dev pulls and serves. See the handbook's
  Pages chapter in hutao/vps. It is the only repo in that org with Actions on:
  the mirrors there carry upstream's `.github/workflows`, which Forgejo would
  otherwise run on every mirrored push.

Adding an app is one line in `sites.json`. Without an entry in
`src/lib/apps.ts` it is listed under "Other" with a plain icon.
