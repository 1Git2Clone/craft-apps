# AGENTS.md — craft-apps

The guide for every agent and contributor working here. Most of the
"Design criteria" below came from changes the owner asked for after a first
attempt, so they are not preferences to weigh against your own: follow them,
and when something here is wrong, change this file in the same branch.

## What this is

The open-source storytold craft apps (PhotoCraft, GridCraft, …) in the
browser, under one bar with an app switcher. An **unofficial** host. Each app
is upstream's prebuilt web build (Rust, egui on a `<canvas>`), served
unmodified in an iframe from `/apps/<name>/`; this repo builds only the bar
and the pages around it.

Published twice from the same commit, each forge running only its own
workflow:

- Forgejo `craft-projects/pages` → `.forgejo/workflows/pages.yml` → an
  artifact the owner's VPS serves at crafts.hu-tao.dev.
- GitHub `1Git2Clone/craft-apps` → `.github/workflows/pages.yml` → GitHub
  Pages, under `/<repo>/`. Anything that builds a URL must work under a base
  path (`$app/paths`), and the "how this site is published" link comes from
  the CI environment, so a fork links to itself.

## Stack

- SvelteKit 2, Svelte 5 runes, prerendered with `adapter-static`.
- Tailwind CSS 4, configured in `src/routes/layout.css` (`@theme`).
- **Vite+** (`vite-plus`, the `vp` CLI) for lint (Oxlint) and format (Oxfmt),
  configured in `vite.config.ts`. No ESLint, no Prettier. Oxfmt does not
  format `.svelte` files, so keep those tidy by hand.
- pnpm; Node per `package.json` `engines`; `nix develop` for the shell.
- Run tools through pnpm (`pnpm check`, `pnpm lint`, `pnpm format`,
  `pnpm exec vp …`): `vp` is a local dependency, not on PATH.

## Layout

```text
sites.json                 the apps and their pinned versions: the one source
scripts/fetch-apps.sh      downloads + checksums each release into static/apps/
src/lib/apps.ts            each app's name, description, category, icon, colour
src/lib/icons.ts           icons by English name
src/lib/colours.ts         the Colour type, hex(), the named app colours
src/lib/themes.ts          the Theme type and the top bar's themes
src/lib/theme.svelte.ts    the current theme (remembered per browser)
src/lib/funnel.ts          the popover open/close animation
src/lib/components/
  layout/                  page chrome: Header, Popover, IconButton
  apps/                    AppSwitcher, AppMenu, About, ThemePicker, AppFrame, …
  icons/                   one SVG per component
src/routes/[app]/          one prerendered page per app
```

## Design criteria

### Code reads like source, not build output

- One CSS property per line; descriptive names; small functions. If a file
  looks like a `dist/` directory, it is wrong regardless of how short it is.
- Components follow hu-tao-dev's pattern: small single-purpose components in
  `src/lib/components/<area>/`, props through `$props()`, imported via
  `$lib/components/…`.
- **The code's hierarchy mirrors the UI's.** A trigger and what it opens live
  in one component (`AppSwitcher` = button + menu, `About`, `ThemePicker`).
  Do not hoist a `bind:` up a level to wire a button in one component to a
  popover in another: the page should read as what it shows.
- A route file is composition: `+page.svelte` for an app is the head and
  `<Header>` + `<AppFrame>`, nothing more.

### The data model is named and typed

- Name things in English, never inline the raw value: an app says
  `icon: 'camera'` and `colour: 'gold'`, not an SVG string or a hex code.
- Make invalid values unrepresentable. `Colour` is a branded type that only
  `hex()` can produce, and `hex()` checks the code at compile time. A plain
  `string` is not a colour.
- Themes are first-class: a `Theme` must set every `ThemeSlot`, and switching
  is assigning a `ThemeName`. Add a slot to the type before using it.
- One source of truth per fact. Versions live only in `sites.json` (the page,
  the fetch script and Renovate all read it). Adding an app is one line
  there; an app with no entry in `apps.ts` falls back to "Other".

### Look and feel

- Default theme "Classic": Photoshop's neutral greys with its blue. Themes
  apply to the **top bar and its menus only**, never to the apps.
- The funnel (macOS-minimize-style) animation is for the bar's popovers
  only. More places makes it overwhelming. Respect
  `prefers-reduced-motion`.
- Button-like links: no underline, pointer cursor, transparent at rest, a
  slightly brighter background and a small `scale()` from the **centre** on
  hover. Transforms only, so the bar never reflows.
- The menu groups apps (Creative, Office, Engineering) and scrolls past about
  six.

### Naming and legal

- Not affiliated with ArtCraft or Storytold, and it says so: the About panel
  and the README carry the same disclaimer wording. Do not copy ArtCraft
  One's layout too literally.
- Avoid names that read as someone's trademark: not "Genie" (it is the
  "funnel" here), not "Suite" for a category.
- Upstream apps are MIT OR Apache-2.0; link each app's licences and NOTICE.

## Verifying

- The owner browses with Floorp (Firefox, GPU WebRender). Test anything
  visual in Firefox; Chromium passing proves little. Seams between the
  funnel's slices were invisible in Chromium and in software Firefox, and
  visible on the owner's GPU.
- Headless Chromium cannot open a popover. Say so instead of claiming the
  menus were checked.
- `pnpm check` (types, lint, format) and `pnpm build` must pass. Build with
  `BASE_PATH=/craft-apps` too when touching URLs.
- `pnpm check` runs, besides svelte-check, Oxlint and Oxfmt, the language
  servers an editor uses (`scripts/lsp-check.mjs`: Svelte's and Tailwind's)
  and fails on any warning or deprecation they report. Both workflows run it.
  When something slips past it, extend the check rather than this file.

## Workflow

- Serve locally for review before anything reaches `main`
  (`pnpm build`, then serve `build/`). The owner reviews, then asks to push.
- Never push without being asked. `main` tracks Forgejo (`origin`);
  GitHub is `github`, pushed explicitly.
- Never commit `static/apps/` (fetched) or `build/`.
