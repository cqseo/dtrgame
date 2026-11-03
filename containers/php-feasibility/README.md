# Original PHP runtime feasibility

This isolated image checks PHP runtime dependencies only. It does not include
the game source, database credentials, a web server, durable storage, a MySQL
server, or the original game daemon. Do not deploy it as a game.

The original reference is PHP 8.2.35 with MySQL 5.7 and uses `mysqli`, `curl`,
`sockets`, `mbstring`, `gd` and `zlib`. Confirm each dependency in the actual
final image; this probe adds `mysqli`, `pdo_mysql` and `sockets` to the cached
PHP CLI image, which already exposed `curl`, `mbstring`, and `zlib` locally.
The CLI image was not verified to have `gd`.

Build in a resource-limited disposable environment with no game files:

```
docker build --network=none --memory=256m --cpu-period=100000 --cpu-quota=25000 -t dtr-php-probe containers/php-feasibility
docker run --rm --network=none --memory=192m dtr-php-probe php -m
```

The original daemon calls its own HTTP endpoint and uses local sockets and
temporary files; a single-process PHP development server cannot be assumed to
work. Cloudflare container disks are ephemeral. A real implementation requires
a concurrent web server, supervised daemon, durable MySQL-compatible database,
durable game/replay files, isolated credentials, startup and crash recovery,
and verification of scheduled events and complete multiplayer sessions.
The existing Supabase/PostgreSQL staging database is not a drop-in MySQL
database. Never point the test at production data or upload captured configs.

## Isolated runtime observations, 2026-11-03

On a private Docker network with no published ports, a disposable MariaDB
10.11 instance received only the 66-table schema of the isolated reference
database and two newly created synthetic users. The original source was
copied separately, configured for that disposable database, and served by
the PHP CLI server with two workers. This setup is for testing only.

The PHP image built without network access. The PHP 8.2.34 CLI loaded mysqli,
PDO MySQL, sockets, curl, mbstring and zlib; the original reference host uses
PHP 8.2.35. The original homepage returned 200. Both synthetic users logged in,
created and joined a room, took seats, read room status, prepared and saw
their game interfaces. Two stance commands persisted distinct values in the
test database. Sampled usage after these operations was about 67 MiB for the
PHP container and 101 MiB for MariaDB; this is not a peak or a Cloudflare
measurement. The original PHP game has not been deployed to Cloudflare.

A later local synthetic match completed after 25 turn iterations. The MySQL
test database recorded a player-versus-player death and the winner in
`acbra2_shistory`, with one participation for each user and one win for the
winner. Both users re-entered after a PHP-container restart and loaded their
end pages twice without changing the recorded gold or counts. The PHP restart
retained runtime files because this local test uses a host bind mount, which
does not establish Cloudflare container persistence. A restart of the same
MariaDB container retained the synthetic account and history rows in its
Docker writable layer, but cleared four room-chat rows in a MEMORY table as
expected. This also does not prove Cloudflare data durability or recovery
during an active game. The web homepage reloaded after the database returned.

A second end-to-end synthetic match also reached a recorded winner; its lethal
encounter was against an NPC, so it is not additional PvP evidence. A third
synthetic match was stopped in progress to test a PHP-container restart. With
the original room directory kept on a local host bind mount and the MariaDB
container still running, both users re-entered and a subsequent stance change
was persisted. This tests application restart with local storage, not loss or
restoration of ephemeral Cloudflare container disks, database crash recovery,
or a production deployment.

In a follow-up, restarting the same local MariaDB container during an active
match retained both synthetic player rows on that container's writable layer.
Both players re-entered and a known available stance change persisted. An
earlier requested `pose2` returned HTTP 200 without changing the pose. Decoding
the original application's response revealed the message “这个姿势太奇怪啦！”;
the game rejected that choice. This exercise does not model loss of the
database container's writable layer.

The source requires game runtime directories such as `gamedata/tmp/rooms`,
`server`, `response`, `processlock`, `playerlock`, `userlock`, `log`, `news`,
and `replay`. A missing rooms directory caused room creation to write a DB row
without creating its cache marker; provisioning the directories fixed that
isolated test. Their behavior after Cloudflare container restarts remains
unverified. Reference MySQL schema metadata reports 58 MyISAM and 8 MEMORY
tables; MEMORY tables do not retain rows on a database server restart. Do not
declare recovery solved without testing how the original game uses them.

`room-smoke.php` is an experimental synthetic test, guarded against execution
outside its named disposable database. It exercises HTTP flows and attempts
to finish a game; it fails when the match does not finish in its turn limit.
HTTP 200 alone is not evidence of a successful action or settlement.
