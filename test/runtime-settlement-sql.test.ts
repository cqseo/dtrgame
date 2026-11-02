import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
// @ts-expect-error Node builtin used only by tests.
import { readFileSync } from "node:fs";
import { createLegacyPlayerRecord } from "../src/generated/legacy-registry";
import { projectLegacySettlement } from "../src/legacy/settlement-plan";
import { legacyDecode } from "../src/original-protocol";
import { legacySettlementHistory, type LegacySettlementReceipt } from "../src/runtime/settlement";
import type { StoredLegacyMatch } from "../src/runtime/game-durable-object";

// Actual PostgreSQL engine in WASM, ephemeral and local: no Supabase URL,
// credentials, imported accounts, external data or production writes.
// PGlite serializes sessions: this suite does NOT prove multi-session locks.
const db = new PGlite();
const matchId = 3_000_000_007;
let snapshot: StoredLegacyMatch;
function initial(): StoredLegacyMatch {
  const a = createLegacyPlayerRecord(); const b = createLegacyPlayerRecord();
  Object.assign(a, { name: "Alpha", pid: 1, type: 0, hp: 100, lvl: 5, killnum: 2, npckillnum: 3, wk: 60, money: 1500 });
  Object.assign(b, { name: "Beta", pid: 2, type: 0, hp: 0, lvl: 2, killnum: 1, money: 800 });
  return { version: 8, state: { matchId, gamestate: 40, gametype: 0,
    players: { Alpha: a, Beta: b }, availableAreas: [1], forbiddenAreas: [], areaNames: ["A"] } };
}
async function loadSnapshot() {
  return (await db.query<{ version: number; state: StoredLegacyMatch["state"] }>(
    "select version,state from dtr_runtime.match_snapshots where match_id=$1", [matchId])).rows[0]!;
}
async function saveFixture() {
  await db.query("update dtr_runtime.match_snapshots set state=$1 where match_id=$2", [snapshot.state, matchId]);
}
async function settle(version = snapshot.version, now = 200, history?: object) {
  const encoded = history ?? await legacySettlementHistory(snapshot, now);
  const result = await db.query<{ receipt: LegacySettlementReceipt }>(
    "select public.dtr_match_settle($1,$2,$3,$4) as receipt", [matchId, version, now, encoded]);
  return result.rows[0]!.receipt;
}
async function balances() {
  return (await db.query("select username,credits,gold,validgames,wingames,lastwin from public.acbra2_users order by username")).rows;
}
async function assertUnchanged() {
  expect(await balances()).toEqual([
    { username: "Alpha", credits: 10, gold: 20, validgames: 2, wingames: 1, lastwin: 50 },
    { username: "Beta", credits: 10, gold: 20, validgames: 2, wingames: 1, lastwin: 50 }
  ]);
  expect(await loadSnapshot()).toEqual(snapshot);
  expect((await db.query("select * from dtr_runtime.match_settlements")).rows).toEqual([]);
  expect((await db.query("select * from public.acbra2_shistory")).rows).toEqual([]);
  expect((await db.query("select gamestate,starttime from public.acbra2_game where groomid=3")).rows)
    .toEqual([{ gamestate: 40, starttime: 100 }]);
}

describe("atomic settlement against actual isolated PostgreSQL", () => {
  beforeAll(async () => {
    await db.exec(`create role anon; create role authenticated; create role service_role;
      create schema dtr_runtime;
      create table dtr_runtime.match_snapshots(match_id bigint primary key,version bigint not null,state jsonb not null,updated_at timestamptz default now());
      create table public.acbra2_users(username text primary key,roomid smallint default 3,
        credits bigint default 10,gold bigint default 20,validgames bigint default 2,wingames bigint default 1,lastwin bigint default 50);
      create table public.acbra2_game(groomid bigint primary key,gamenum bigint default 7,gamestate bigint default 40,
        gametype bigint default 0,groomstatus bigint default 40,groomtype bigint default 0,starttime bigint default 100,
        validnum bigint default 2,alivenum bigint default 2,deathnum bigint default 0,hdamage bigint default 0,
        hplayer text default '',areanum bigint default 1,weather bigint default 0,winmode bigint default 0,winner text default '');
      create table public.acbra2_shistory(gid bigint unique,wmode bigint,winner text,gametype bigint,vnum bigint,
        gstime bigint,getime bigint,gtime bigint,areanum bigint,deathnum bigint,alivenum bigint,hdmg bigint,hdp text,
        hkill bigint,hkp text,winnernum bigint,"winnerteamID" text,winnerlist text,winnerpdata text,validlist text);`);
    await db.exec(readFileSync("supabase/migrations/20261102023311_atomic_settlement_ledger.sql", "utf8"));
    await db.exec(readFileSync("supabase/migrations/20261102024727_settlement_recovery_fence.sql", "utf8"));
    // Migration must install inert, before the fixture explicitly enables it.
    expect((await db.query("select enabled from dtr_runtime.settlement_control")).rows).toEqual([{ enabled: false }]);
  }, 30_000);
  afterAll(async () => { await db.close(); });
  beforeEach(async () => {
    snapshot = initial();
    await db.exec(`truncate dtr_runtime.match_settlements,dtr_runtime.match_snapshots,dtr_runtime.active_matches,
      public.acbra2_shistory,public.acbra2_game,public.acbra2_users;
      update dtr_runtime.settlement_control set enabled=true;
      insert into public.acbra2_users(username) values('Alpha'),('Beta');
      insert into public.acbra2_game(groomid) values(3);`);
    await db.query("insert into dtr_runtime.match_snapshots values($1,$2,$3,now())", [matchId, snapshot.version, snapshot.state]);
  });

  it("recomputes original reward deltas, archives decodable history and ends the snapshot in one transaction", async () => {
    const receipt = await settle();
    expect(receipt.plan).toEqual(projectLegacySettlement(snapshot.state.players, 0, 40, 200));
    expect(receipt.snapshot.version).toBe(9);
    expect(receipt.snapshot.state.gamestate).toBe(0);
    expect(receipt.snapshot.state.players.Alpha?.winner_flag).toBe(2);
    expect(receipt.snapshot.state.players.Beta?.hp).toBe(0);
    expect(await balances()).toEqual([
      { username: "Alpha", credits: 244, gold: 140, validgames: 3, wingames: 2, lastwin: 200 },
      { username: "Beta", credits: 33, gold: 30, validgames: 3, wingames: 1, lastwin: 50 }
    ]);
    const history = (await db.query<{ validlist: string; winnerpdata: string }>("select validlist,winnerpdata from public.acbra2_shistory")).rows[0]!;
    expect(await legacyDecode(history.validlist)).toMatchObject({ Alpha: { winner_flag: 2 }, Beta: { hp: 0 } });
    expect(await legacyDecode(history.winnerpdata)).toMatchObject({ name: "Alpha", winner_flag: 2 });
    expect(await loadSnapshot()).toEqual(receipt.snapshot);
  });

  it("returns the immutable receipt on duplicate retries, including after disabling new settlement", async () => {
    const receipt = await settle(); const paid = await balances();
    await db.exec("update dtr_runtime.settlement_control set enabled=false");
    expect(await settle(0, 999, { invalid: "ignored for a committed match" })).toEqual(receipt);
    expect(await balances()).toEqual(paid);
    expect((await db.query("select count(*)::int n from public.acbra2_shistory")).rows).toEqual([{ n: 1 }]);
    expect((await db.query("select count(*)::int n from dtr_runtime.match_settlements")).rows).toEqual([{ n: 1 }]);
    const saved = await db.query<{ saved: boolean }>("select public.dtr_match_save($1,999,$2) saved", [matchId, snapshot.state]);
    expect(saved.rows[0]?.saved).toBe(false);
    expect(await loadSnapshot()).toEqual(receipt.snapshot);
  });

  it("fences an uncommitted response-lost attempt before a delayed settlement can write rewards", async () => {
    const before = await balances();
    const result = await db.query<StoredLegacyMatch>("select * from public.dtr_match_reconcile($1,$2)", [matchId, 8]);
    expect(result.rows[0]).toEqual({ ...snapshot, version: 9 });
    expect(await balances()).toEqual(before);
    await expect(settle(8)).rejects.toThrow("stale settlement version");
    expect((await db.query("select * from public.acbra2_shistory")).rows).toEqual([]);
    // A recovery retry must not continue incrementing the same fence.
    expect((await db.query<StoredLegacyMatch>("select * from public.dtr_match_reconcile($1,$2)", [matchId,8])).rows[0]?.version).toBe(9);
    expect((await settle(9)).snapshot.version).toBe(10);
  });

  it("recovery after a committed request returns the exact terminal snapshot without a new payout", async () => {
    const receipt = await settle(); const paid = await balances();
    expect((await db.query<StoredLegacyMatch>("select * from public.dtr_match_reconcile($1,$2)", [matchId,8])).rows[0]).toEqual(receipt.snapshot);
    expect(await balances()).toEqual(paid);
    await expect(db.query("select * from public.dtr_match_reconcile($1,999)", [matchId])).rejects.toThrow("older than pending");
  });

  it("allocates shared subroom history gids and preserves identity across room reuse", async () => {
    await db.exec("insert into public.acbra2_shistory(gid) values(100)");
    expect((await settle()).historyGid).toBe(101);
    expect((await db.query("select match_id from public.dtr_legacy_user_match('Alpha')")).rows).toEqual([{ match_id: matchId }]);
    await db.exec("update public.acbra2_game set gamenum=102,gamestate=40");
    expect((await db.query("select match_id from public.dtr_legacy_user_match('Alpha')")).rows).toEqual([{ match_id: 3_000_000_102 }]);
    // Old receipt remains immutable even if the physical room is reused.
    expect((await settle()).historyGid).toBe(101);
  });

  it.each(["disabled", "stale", "recycled", "mode", "unfinished", "invalid-roster", "duplicate-pid", "missing-account", "forged-history"])(
    "rejects %s without any payout or partial state", async kind => {
      if (kind === "disabled") await db.exec("update dtr_runtime.settlement_control set enabled=false");
      if (kind === "recycled") await db.exec("update public.acbra2_game set gamenum=99");
      if (kind === "mode") snapshot.state.gametype = 20;
      if (kind === "unfinished") snapshot.state.players.Beta!.hp = 10;
      if (kind === "invalid-roster") snapshot.state.players.Beta!.name = "Forged";
      if (kind === "duplicate-pid") snapshot.state.players.Beta!.pid = 1;
      if (kind === "missing-account") await db.exec("delete from public.acbra2_users where username='Beta'");
      await saveFixture();
      const before = await balances();
      const history = { validlist: "server-only-fixture", winnerpdata: "server-only-fixture" };
      if (kind === "forged-history") Object.assign(history, { gold: 999999 });
      await expect(settle(kind === "stale" ? 7 : 8, 200, history)).rejects.toThrow();
      expect(await balances()).toEqual(before);
      expect(await loadSnapshot()).toEqual(snapshot);
      expect((await db.query("select * from dtr_runtime.match_settlements")).rows).toEqual([]);
      expect((await db.query("select * from public.acbra2_shistory")).rows).toEqual([]);
    });

  it.each(["acbra2_users", "acbra2_shistory", "match_settlements", "match_snapshots", "acbra2_game"])(
    "rolls back all changes when a failure is injected at %s", async table => {
      const schema = table.startsWith("acbra2") ? "public" : "dtr_runtime";
      await db.exec(`create or replace function public.fixture_fail() returns trigger language plpgsql as $$ begin raise exception 'injected fault'; end $$;
        create trigger fixture_failure before ${table === "match_settlements" || table === "acbra2_shistory" ? "insert" : "update"} on ${schema}.${table}
        for each row ${table === "acbra2_users" ? "when (NEW.username='Beta')" : ""} execute function public.fixture_fail();`);
      try { await expect(settle()).rejects.toThrow("injected fault"); }
      finally { await db.exec(`drop trigger fixture_failure on ${schema}.${table}`); }
      await assertUnchanged();
      expect((await settle()).snapshot.state.gamestate).toBe(0);
    });

  it.each([1, 10, 14, 15, 16, 17, 20])("keeps SQL rewards equivalent to original projection for gametype %s", async mode => {
    snapshot.state.gametype = mode;
    snapshot.state.players.Alpha!.teamID = "Red";
    snapshot.state.players.Beta!.teamID = "Red";
    await db.query("update public.acbra2_game set gametype=$1", [mode]);
    await saveFixture();
    expect((await settle()).plan).toEqual(projectLegacySettlement(snapshot.state.players, mode, 40, 200));
  });

  it("handles all-dead games without inventing a winner", async () => {
    snapshot.state.players.Alpha!.hp = 0;
    await saveFixture();
    expect((await settle()).plan.decision).toMatchObject({ winmode: 1, winners: [] });
  });

  it("handles zero entrants without account writes", async () => {
    snapshot.state.players = {};
    await db.exec("update public.acbra2_game set validnum=0");
    await saveFixture();
    const before = await balances();
    expect((await settle()).plan).toEqual(projectLegacySettlement({}, 0, 40, 200));
    expect(await balances()).toEqual(before);
  });

  it("keeps rounding and capped reward components equivalent at boundary values", async () => {
    Object.assign(snapshot.state.players.Alpha!, { lvl: 999, wk: 99999999, money: 99999999 });
    Object.assign(snapshot.state.players.Beta!, { hp: -3, lvl: 1, wk: 12.5, money: 250 });
    await saveFixture();
    expect((await settle()).plan).toEqual(projectLegacySettlement(snapshot.state.players, 0, 40, 200));
  });

  it("denies RPC and private tables to both browser roles", async () => {
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`set role ${role}`);
      try {
        await expect(settle()).rejects.toThrow(/permission denied/);
        await expect(db.query("select * from dtr_runtime.match_settlements")).rejects.toThrow(/permission denied/);
        await expect(db.query("select * from public.dtr_match_reconcile($1,8)", [matchId])).rejects.toThrow(/permission denied/);
      } finally { await db.exec("reset role"); }
    }
    expect((await db.query("select prosecdef,proconfig from pg_proc where proname='dtr_match_settle'")).rows)
      .toEqual([{ prosecdef: true, proconfig: ['search_path=""'] }]);
    await assertUnchanged();
  });
});
