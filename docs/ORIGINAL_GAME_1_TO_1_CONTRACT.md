# DTS 1:1 PORT — NON-NEGOTIABLE ORIGINAL GAME CONTRACT

**User requirement confirmed 2026-10-28:** The delivered Cloudflare version must be the *same ACFUN 大逃杀 game*, with only the underlying runtime/language and necessary storage implementation changed. It must **not** be a redesign, spiritual successor, new game, rebranded interface, simplified game, or change to numerical rules.

## Immutable sources of truth
- Original game: `/www/wwwroot/dts-game-test` on Baota `VM-0-10-opencloudos`.
- Actual installed source modules: `gamedata/modules.list.php` with 735 enabled and 9 disabled. Respect initialization order.
- Original asset and template snapshot: `/opt/dts-sandbox/backups/legacy-ui-reference-20261028/original-full-ui-only.tar.gz`.
- SHA-256 archive: `8776a1e8f18d0ea57f8fe4ed7a9d8dd06d3eeae81dfa753aff1f36567777cc49`.
- Asset hash manifest: `/opt/dts-sandbox/backups/legacy-ui-reference-20261028/full-ui-manifest.json`.
- The snapshot includes **1,573 original presentation files** (all 864 `.htm` files, 1 `.HTML`, 12 CSS, 12 JS, 389 PNG, 255 GIF, 32 JPG, 113 root template files including language pack, and other original media). Verified: 1,573 / 1,573 entries match SHA-256 and length, zero mismatches.
- Original assets are read-only. NEVER modify live PHP gameplay to make the port easier.

## Exact frontend contract
1. **Same name/branding:** `<title> ACFUN 大 逃 杀 </title>`. Do not rebrand to “无限轮回 · MUGEN LOOP”.
2. **Same URL paths:** preserve original public `index.php`, `game.php`, `roomcmd.php`, `roomupdate.php`, `command.php`, `login.php`, `register.php`, `map.php`, `rank.php`, `replay.php`, `user.php` etc. They can be served by Cloudflare Workers; the browser must not know the backend language has changed.
3. **Same original markup and CSS and JS:** templates under `templates/default`, `templates/2`, and 740 module-owned `.htm` files are canonical. Preserve HTML element IDs/classes, forms, scripts, source order, mobile styles, background, images, layout and interactions. No React-like redesign, different component interface or new application title.
4. **Same original client/server messaging:** `postCmd('gamecmd','command.php')`, `postCmd('roomcmd','roomcmd.php')`, `roomupdate.php`, original cookies, session transitions, original request names, original response message structure and encoding. The browser's existing `include/javascript/game.20240318.js` and `common.20240301.js` should not need modifications.
5. **Same all-mode and all-module behavior:** 735 enabled source modules, their load order and relevant skill/card/club/achievement/instance/gameflow interactions; exact map, loot, equipment, item combinations and hidden recipe conditions, combat formulas, timing, weather and death/win conditions. Keep original values.
6. **Same player behavior/data:** login, character creation, state, stats, quests, records, ranks, chat, replay, room joins and persistence must be equivalent. No record reset or forced recreation.
7. **Same user-facing language:** do not rewrite or simplify Chinese UI labels, help, system messages or modes.

## Technical implementation approach
- New runtime may be TypeScript/JavaScript on Cloudflare Worker and Durable Objects. This is an implementation detail only; the user-facing behavior must remain the old game.
- Reuse the exact original static asset files and source template strings. Port the PHP template directives (`{template}`, `{lang}`, `<!--{if}-->`, `{eval}`, `{loop}`, variable interpolation) and every referenced module dynamic UI into equivalent server-side template functions; no PHP runtime dependency in production.
- Reimplement the original PHP request handlers and module functions in TypeScript, preserving original action ordering and response format; reimplement background daemon, room and database behavior with equivalent semantics.
- Use **old-version executable responses as golden master fixtures** for logged-out/login/game/room and each action, excluding unstable tokens, passwords and timestamps only when strictly necessary.
- Build a deterministic parity harness and snapshot tests comparing actual original and new generated HTML + action results + persistence transitions, with visual screenshots at desktop/mobile sizes.
- The existing `public/index.html`/new `public/app.js` MUGEN LOOP Worker is a prototype and **is not a compliant release**. Do not preserve its design, custom names or reduced rules in final migrated game.

## Release gates
Do not claim complete until: static asset hashes match; all original public URLs and legacy JS requests work; original templates render equivalently across states; all enabled modules have parity tests; visual diffs are addressed; complete gameplay end-to-end including each enabled mode passes; account/game storage migration tested; no destructive changes to player data; backup and rollback tested.

**Deployment constraint:** use Cloudflare API connector only after a staging release passes parity, no GitHub Actions. Keep `dtrgame` as-is while building the compliant old UI in a separate preview; never replace it with an unverified version.
