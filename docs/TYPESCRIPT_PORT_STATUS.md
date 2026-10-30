# ACFUN DTS TypeScript port status

This ledger is generated against the captured Baota baseline. It prevents a partially playable rewrite from being reported as a 1:1 port.

- Modules listed by the legacy loader: **744**
- Enabled modules: **735**
- Fully parity-accepted modules: **0**
- Partially ported modules: **34**
- Pending modules: **710**
- Original hook implementations ported: **56 / 5,235 (1.07%)**, missing **5,179**
- Player database fields captured: **124**
- Original public routes reproduced byte for byte: **12 / 23 captured**
- Original templates compiling to identical bytes: **845 / 845**
- Automated TypeScript tests: **175** plus **11** PHP-oracle assertions that execute and pass against the original interpreter

Module counts and the partial list below are taken from `docs/legacy-module-migration.json`, which `npm run generate:migration` derives from the captured source. Earlier revisions of this page carried a hand-edited list that had drifted to 37 modules; the generator is the only authority.

Partially ported modules: `map`, `player`, `explore`, `lvlctl`, `itemmain`, `metman`, `itemmix`, `edible`, `corpse`, `itemmix_sync`, `enemy`, `itemmix_overlay`, `team`, `battle`, `attack`, `weapon`, `wep_n`, `wep_p`, `wep_k`, `wep_c`, `wep_d`, `wep_f`, `wound`, `wep_g`, `wep_j`, `armor`, `rest`, `pose`, `tactic`, `weather`, `attrbase`, `wep_b`, `cooldown`, `ex_residue`.

## Hook-level truth

Module status is a coarse measure: 34 modules carry a "partial" label while contributing only 56 of the original's 5,235 hook implementations between them. `test/legacy-real-hook-coverage.test.ts` audits the real production kernel (`LEGACY_BASE_COMMAND_KERNEL`) against the captured manifest, records the figure above as a ratchet, and additionally fails if the kernel ever registers a hook that does not exist in the original. Raise its baseline only when real hooks land.

## PHP reference interpreter

The live original is served through `php-cgi-82.sock`, so golden masters must be produced by **PHP 8.2.35**, not 8.3; the minor version changes semantics that parity depends on. `tools/php-remote` bridges to that interpreter on the Baota host over SSH and is used automatically by `npm run test:php-parity`, which refuses to run on any other minor version. The remote side reads only the frozen, write-protected copy at `/opt/dts-sandbox/parity/legacy-dts`; the live site is never written to.

Before this harness ran, the seven PHP-oracle assertions had always been reported as skipped, so no TypeScript behaviour had ever been compared against the original interpreter. They now execute and pass, which makes crafting the first area with evidence rather than intent behind it. `npm run test:php-parity` auto-discovers every `test/*.parity.test.mjs` suite, so new areas join the gate as they are written.

## Request-level parity

The PHP oracle compares pure functions. Whole responses are now compared too: an isolated instance of the captured source runs under PHP 8.2.35 behind a copy of the production nginx routing contract, against its own database, so it can be driven freely without touching the live site or live player data. `npm run capture:golden` records whole responses from it into `test/fixtures/golden/`, and `test/original-routes-golden.test.mjs` replays each one against the Worker.

Current result: **12 of 23 captured routes match the original**, byte for byte.

Reproduced so far:

- The edge routing contract — `/gamedata/` 403, `/include/` 403, `/install/` 403, `install_NEW.php` 410, `command.php` GET 403 with POST only — in `src/original-routing.ts`, with nginx's own error pages.
- The two client scripts the original's pages load, served from the asset bundle.
- `donate.php` and `login.php`, which the original answers with a single template render.
- `cardbook.php`, `kujilist.php` and `chat.php` signed out, where the original refuses before any of its own content runs.

The remaining 11 are `index.php`, `register.php`, `game.php`, `end.php`, `rank.php`, `help.php`, `map.php`, `itemhelp.php`, `roomcmd.php`, `roomupdate.php` and `command.php`. Each needs original module functions, player data, or both; they are not blocked on presentation. The figure is a ratchet; raise it only when a route genuinely starts matching.

### What those pages are waiting on

`rank.php`, `help.php`, `end.php` and `game.php` are thin: each calls `render_page('command_X')`, which POSTs to the site's own `command.php` and returns the result. `command.php` is the engine the whole game funnels through, so those four arrive together with it rather than one at a time.

The rest name the hook they stop at: `map.php` at `\map_display\get_map_display_config`, `register.php` at `\player\icon_parser`, `index.php` at `room_check_subroom`, `end.php` at `\player\get_dinfo`, `game.php` at `\gameflow_duel\is_gamestate_duel`.

## The template engine

`src/legacy/template/` is a complete port of the original's rendering path, verified against the original rather than against expectations.

The compiler reproduces `parse_template` rewrite for rewrite: **all 845 templates compile to identical bytes**, 105 in the pack and 740 module-owned. Its output is PHP, and Workers forbid generating code at runtime, so the compiled text is interpreted — a lexer that alternates between HTML and code as PHP does, a parser with PHP 8 precedence, and an evaluator over PHP's own value semantics (ordered-map arrays, `"0"` falsy, PHP 8's number-to-string comparison, byte-based `strlen` and `strpos`, halves rounding away from zero). The library is the forty-odd functions an inventory of all 858 templates shows they actually call.

**Of the templates the original itself can render standalone, all 64 render to identical bytes, none differing.** The other 41 fail in PHP too without a page around them.

A module function that is not ported raises rather than returning a plausible value, so a missing hook cannot quietly render as empty and pass for correct.

## Templates are not a separate phase

`npm run audit:templates` inventories what the original's 858 templates actually contain, because the port needs an equivalent of `include/template.func.php` — the Discuz-derived compiler that rewrites `.htm` into PHP — and a Worker cannot evaluate PHP.

Directive usage: 2,300 `{if}`, 1,842 `{template}`, 1,752 `{eval}`, 775 `{else}`, 259 `{elseif}`, 256 `{loop}`, 184 `{lang}`. Distinct expressions: 1,448 `eval`, 1,244 conditions, 182 loops.

The decisive number is that **871 of those distinct expressions call original module functions** — 515 of the `eval` statements and 356 of the conditions. `import_module` alone appears 281 times, `skill_getvalue` 189. Templates also use PHP variable variables (`${'ar'.$apl.'s'}`), which `parse_template` handles with a dedicated rewrite.

So rendering a page is not a presentation exercise that can follow the module port: roughly a third of template expressions are calls into the very hooks that are still missing. The sequence in the handoff treats page fidelity as a later phase, which would mean building a template engine with nothing to call. Work proceeds in vertical slices instead — take one original URL, port the modules its templates reach, and hold the whole response to its captured fixture.

## Milestones

Compatibility-kernel milestone: the original loader order, mandatory dependency graph, newest-first hook dispatch, `$chprocess` parent calls (including repeated calls and changed arguments), PHP reference parameters, request globals, deterministic RNG checkpoints, state rollback and execution tracing are implemented. The captured graph contains **3,211 hook names / 5,235 implementations / 505 overloaded chains**. This infrastructure does not count any unported hook body as complete.

Runtime milestone: one active match is serialized by a Cloudflare Durable Object. Its base `command.php` transaction now covers movement, search, cooldowns, rest, pose/tactic changes, wounds, team create/join/quit, weather/pose-modified map-item discovery and removal, pending-item pickup/merge/full-pack behavior, inventory use/move/merge, edible effects, weapon/armor/accessory equip-swap-unequip, condition medicine, ammunition loading, item drops back into the persistent map pool, and item crafting. Search/move now traverses the original player/corpse encounter order, including encounter, visibility, initiative and corpse-protection rolls. Corpse money/destruction/item transfer validates the stored corpse action and commits looter plus corpse atomically. A serialized two-player assault transaction covers base hit/damage, weapon use and breakage, mastery/experience, death state, kill counters, range and counterattacks, then commits both players in one match version; failed initiative immediately runs the defender's attack in that same transaction. Versioned full-match snapshots are persisted through service-role-only Supabase RPCs; initialization writes version zero, later versions are monotonic, and an empty Durable Object can restore the latest validated snapshot. The private table has RLS enabled and no client grants. This is still staging and does not yet make the full game playable.

Authenticated transport milestone: `login.php` now executes the original MD5 compatibility flow against the isolated QA user table, records `lastvisit`, clears the previous room, emits the original 15-day `bra_user`/`bra_pass` cookies and supports logout. `roomcmd.php` now reaches atomic create/join RPCs and one serialized Durable Object per waiting room; entry chat, room cookies and Supabase `roomvars` persistence are connected. The two write RPCs use transaction locks and are executable by `service_role` only; `anon` and `authenticated` have no grant. The original signed-in index/room HTML and start-to-match bridge remain incomplete, so this does not yet constitute a playable E2E.

"Partial" means only the named, tested mechanics have been translated. A module can become "complete" only after every code/config/template hook has a parity fixture against `/www/wwwroot/dts-game-test`.

Run `npm run generate:migration` beside the captured legacy source to regenerate the full 744-row JSON ledger at `docs/legacy-module-migration.json`.
