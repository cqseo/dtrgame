# Original HTTP continuation — 2026-10-31

Base: f54d78a. This branch is not a playable release.

Implemented:
- Unknown compiled-function reference metadata returns undefined, permitting the builtin preg_match/preg_match_all reference signatures to apply.
- Original page responses preserve HTTP status, redirects and multiple Set-Cookie headers; server port is supplied for Secure cookies.
- Runtime tests cover capture writeback, cookie isolation, compiled game logout and compiled maintenance denial.
- Applied scripts/secure-original-tables.sql to Supabase project qtjcjmpapjsgrrgtfica. Verified 66 original tables have RLS enabled, zero PUBLIC/anon/authenticated table grants, and service_role retains access to all 66. No game rows deleted.

Blocking correctness gaps found during inspection:
- MemoryLegacyDatabase INSERT assigns insert_id from snapshot row count but does not assign the row primary key. Supabase commit requires that key. Filtered account snapshots cannot allocate globally unique user IDs. Use database-backed ID allocation and defaults; do not derive IDs from snapshot length or silently overwrite existing accounts.
- Generic command.php requests still use the temporary game service. Only the routine branch invokes compiled original code. Do not label compilation coverage as gameplay parity.
- Account/lobby/match RPCs still reference the QA schema while the newer page snapshot RPCs use public.acbra2_*; unify identity/data before switching all requests.
- Original common.inc substitution describes a routine tick, but its implementation currently imports modules and initializes input without performing the full original bootstrap. Review against the PHP baseline.
- The original game frame, room startup, full match lifecycle, concurrent writes and all gameplay need end-to-end oracle validation.
- Remote Desktop Commander shows VM-0-7 online but command calls return Not connected. VM-0-10 is offline. No local PHP executable or usable SSH bridge configuration was present. Claude's unpushed changes could not be read.

Do not deploy this branch over newer uncommitted staging work without reconciling it. Complete original-vs-TypeScript tests before claiming 1:1 or changing playable=false.
