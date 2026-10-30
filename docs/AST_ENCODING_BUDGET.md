# How much of the original fits in a Worker

## Why this was measured

Compiled modules are checked in as ASTs, so the Worker never generates code
at run time. That choice needs a number attached to it, because a Worker
script has a hard size limit and one game tick dispatches through 282
modules.

An early estimate said the ASTs would blow that limit and that the encoding
would have to get denser before the tick could ship. The limit part was
wrong; the encoding part turned out to matter for a different reason.

Reproduce the AST figures with `node scripts/measure-ast-encoding.mjs`.

## The ASTs alone

| set | modules | functions | raw JSON | gzip | brotli |
|---|---:|---:|---:|---:|---:|
| one game tick | 118 | 1,510 | 3.76 MB | 239 KB | 144 KB |
| everything enabled | 752 | 6,076 | 11.43 MB | 678 KB | 382 KB |

## The bundle, which is what actually ships

The ASTs alone are not the cost. With 286 modules compiled — the closure of
one game tick plus map.php — a real build gives:

| generated output | repo | bundle raw | bundle gzip |
|---|---:|---:|---:|
| pretty-printed | 25 MB | 26,010 KB | 1,660 KB |
| compact | 11 MB | 12,732 KB | 1,031 KB |

Dropping the indentation took 38% off the gzipped bundle for no change in
what is represented, so the generator emits compact output. These files are
generated, never read as prose and never hand-edited.

At 1,031KB against a 3MB limit, with roughly 470KB of that being the rest
of the Worker, 286 modules cost about 560KB, or near 2KB each — about twice
what the ASTs weigh standalone. Every enabled module at that rate would be
roughly 1.5MB, which still fits.

## Three wrong numbers, and what they have in common

**"28KB gzipped per module."** From differencing two builds and blaming the
modules for all of it, when that build also gained the module runtime, the
new builtins and exception support.

**"6.46MB for 735 modules."** From extrapolating the five modules compiled
at the time, in which `sys` was more than half the bytes. Modules vary by
two orders of magnitude.

**"The bundle cost matches the standalone AST measurement."** It does not;
in a bundle it is about twice as much.

All three came from inferring a number instead of measuring the thing that
ships. The figures above are from real builds.

## Tokenising does not help

Hoisting node kinds, field names and string literals into lookup tables
cuts the raw size by a third, and then gzip closes the gap exactly: 22,305
bytes against 22,281, marginally worse. gzip already models the repetition
those tables were meant to remove.

An earlier run of that experiment reported a large saving only because it
serialised the lookup tables before filling them, so it counted the indices
without the strings they point at.

## Where this leaves the budget

There is no size problem to solve. The tick is compiled and the bundle sits
at a third of the limit. If the remaining work ever brings it close again,
brotli is worth 40% more than gzip in every measurement here, before any
encoding change is worth considering.
