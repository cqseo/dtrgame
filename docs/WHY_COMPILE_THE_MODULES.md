# Why the modules get compiled, not hand-ported

## The problem with hand-porting

`test/legacy-real-hook-coverage.test.ts` measures the real figure: 56 of the
original's 5,235 hook implementations are ported, or 1.07%. Hand-porting has
been running at roughly five functions per commit, each with its own parity
test. At that rate the remaining 5,179 are not a schedule, they are a
decade.

Worse, hand-porting is where the contract gets broken. Three of the seven
numbers the kernel had hardcoded turned out to be invented structure: the
original reads `$movecoldtime`, `$searchcoldtime` and `$itemusecoldtime` from
the cooldown module's config, and four different skills override them. The
values happened to be right. The next one would not be.

## What the original's modules actually are

PHP's own tokenizer was pointed at all 1,661 module files
(`npm run audit:module-syntax`, recorded in `module-syntax-census.json`):

| construct | count |
|---|---:|
| function declarations | 6,081 |
| by-reference parameters | 3,509 |
| `eval` (two fixed idioms) | 8,624 |
| string interpolations | 2,569 |
| variable variables | 226 |
| `foreach` / `for` / `while` / `do` | 583 / 196 / 110 / 21 |
| `list` / `unset` / `global` | 177 / 120 / 102 |
| `switch` | 7 |
| heredocs | 3 |
| variadics | 1 |
| **classes, interfaces, traits, enums** | **0** |
| **try / catch / finally** | **0** |
| **closures, arrow functions, generators, `match`, `goto`** | **0** |

`new` and `throw` appear six times each, at the same six lines, in two files
— `base/skillbase/main.php` and `modules.func.php`, both already ported by
hand.

Every one of the 329 `->` uses in the entire module tree is on the database
object, and between them they call eleven methods:

    query  fetch_array  num_rows  array_insert  array_update
    insert_id  result  queries  multi_update  data_seek  affected_rows

So the whole game logic needs exactly one host object, with eleven methods,
and nothing else from PHP's object model.

## Why this makes a compiler the cheaper path

This is a narrow, uniform language: namespaced functions over arrays and
scalars, four loop forms, references, string interpolation, and two `eval`
idioms that are already understood (`eval(__MAGIC__)` is the hook-dispatch
prologue, `eval(import_module('x'))` is the module-variable import).

The template compiler is the precedent. `src/legacy/template/compile.ts` is a
rewrite-for-rewrite port of the original's `parse_template`, and it produces
byte-identical output for all 845 templates — 105 in the template pack and
740 module-owned. The lexer, PHP 8 precedence parser, `PhpArray` value
semantics and the forty builtins it needed already exist and are already held
to the original by parity tests.

A module compiler reuses all of that and adds statements, function
declarations and references. Its output is checked in and reviewed, and
Cloudflare Workers never see runtime codegen.

## How it stays 1:1 rather than becoming a second implementation

The compiler does not get to be trusted. Every compiled function is held to
the original through the existing oracle: `scripts/php-call-reference.php`
calls the real function on PHP 8.2.35 with seeded globals and reads the
globals back, and `test/support/php-oracle.mjs` runs the differential. A
compiled function counts as ported only when it matches on both the return
value and the globals it touched.

That turns the coverage ratchet into a real measure of progress: not
"functions written" but "functions whose behaviour matches the original",
out of 6,081.

## The order of work

1. A vertical slice: compile one real module end to end, including the
   `__MAGIC__` prologue, `import_module`, and by-reference parameters, and
   hold it to the original. This is what proves or kills the approach.
2. The reference representation, since 3,509 parameters depend on it.
3. The `$db` shim's eleven methods, against Supabase.
4. Compile outward along the dependency order the game loop needs:
   player, map, room, then inventory, then combat, then skills and cards.

Non-goals, unchanged: Stripe, login optimisation and distribution stay
untouched until the game itself passes.

## Current implementation checkpoint

The first vertical proof is complete for four functions in the real
`base/cooldown` module. The compiler extracts function boundaries without
being confused by braces in strings/comments, records reference parameters,
literal defaults, and reuses the PHP-subset parser for the hook guard, module
import, branches, assignments and return.
The Worker executes checked-in AST rather than parsing PHP or generating code
at runtime. `get_move_coldtime`, `get_search_coldtime` and
`get_itemuse_coldtime` plus the stateful `set_coldtime` now use that path in
the actual command kernel. The PHP 8.2.35 oracle agrees on return values,
default/forced branches and `cmdcdtime` global writes.

The proof deliberately stops before claiming general coverage. Reference
argument write-back, loops, arbitrary nested calls, the database host and the
other 6,077 declarations remain outstanding.
