# Original PHP compatibility kernel

This kernel is the shared execution layer for the ACFUN DTS TypeScript port. It preserves the behavior of `include/modules/modules.func.php`; it is not a replacement game design.

## Implemented invariants

- Modules are ordered from the captured `gamedata/modules.list.php`, not JavaScript import order.
- The newest implementation is entered first.
- `context.next(...)` is the PHP `$chprocess(...)` parent call.
- A handler may change parent arguments, omit the parent call, or call it multiple times.
- PHP reference parameters use `legacyRef(value)` and retain mutations through the chain.
- Nested hook calls re-enter the newest implementation of the requested function.
- One command is an atomic state boundary: player/room state, globals, output and checkpointable RNG are restored on failure.
- Optional execution traces record enter/next/return/throw/commit/rollback without changing successful results.
- Common PHP 7.4 scalar coercions are centralized in `php-semantics.ts`.

## Generated source authority

`npm run generate:legacy` reads module headers and produces loader order, dependencies, conflicts, codelists and template lists.

`npm run generate:hooks` tokenizes every enabled module codelist and produces the exact function graph and parameter reference metadata:

- 735 enabled modules
- 3,211 function names
- 5,235 function implementations
- 505 functions with more than one module implementation
- 0 missing codelist sources

The strict coverage auditor counts a port only when both the original function name and original module name are registered. Infrastructure and placeholders do not increase completion.

## Next integration gate

Build the command dispatcher and the first complete account/room/game transaction on this kernel. Room persistence is performed after an in-memory command commits; failed commands must never be written to Supabase or Durable Object storage.
