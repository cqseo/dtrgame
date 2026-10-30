# How much of the original fits in a Worker

## Why this was measured

Compiled modules are checked in as ASTs, so the Worker never generates code
at run time. That choice needs a number attached to it, because a Worker
script has a hard size limit and one player action dispatches through about
118 modules.

An earlier estimate here said the module ASTs would blow that limit, and
that the encoding would have to get denser before the game tick could ship.
Both halves of that were wrong. This records the measurement that replaced
them.

Reproduce with `node scripts/measure-ast-encoding.mjs`, which parses the
original's module tree directly.

## The measurement

| set | modules | functions | raw JSON | gzip | brotli |
|---|---:|---:|---:|---:|---:|
| the game tick (one action) | 118 | 1,510 | 3.76 MB | 239 KB | 144 KB |
| everything enabled | 752 | 6,076 | 11.43 MB | 678 KB | 382 KB |

The whole of the original's module code — every function of every enabled
module — is 678KB gzipped. On top of a bundle that is currently 581KB
gzipped without it, that is about 1.3MB, comfortably inside the limit.

So there is no size problem to solve, for the tick or for the complete
port. The encoding work that was planned next is not needed.

## Two wrong numbers, and why

**"28KB gzipped per module."** This came from comparing a build against an
older one and attributing the whole difference to the modules. That build
also gained the module runtime, the new builtins and exception support.
Removing `sys` from a current build and rebuilding gives the real marginal
cost: 609.50KB gzipped with it, 581.46KB without, so 28KB — but that is
`sys` alone, a core module with 40 functions and 555KB of AST, not a
typical one. The average across all 752 is closer to 0.9KB.

**"6.46MB for 735 modules."** This extrapolated from the five modules
generated so far, in which `sys` was more than half the bytes. Modules
vary by more than two orders of magnitude, so a five-module average says
nothing useful. Parsing all 752 gives 11.43MB raw, 678KB gzipped.

The lesson worth keeping: extrapolate from the whole population when it is
cheap to parse, and get the marginal cost by removing something from a real
build rather than by differencing two builds that changed in other ways.

## What is still true

The generated files are pretty-printed, which roughly doubles their
gzipped size for no change in what they represent. That is worth fixing
when convenient, but at these sizes it buys headroom rather than removing
a blocker.

Hoisting node kinds, field names and string literals into lookup tables —
the obvious next step if space were short — does not help. It cuts the raw
size by a third and then gzip closes the gap exactly, because gzip already
models that repetition. Brotli is consistently 40% below gzip, so whether
the platform serves brotli is worth more than any encoding change.
