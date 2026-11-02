import { beforeAll, describe, expect, it } from "vitest";
// @ts-expect-error test-only Node builtin
import { readFileSync } from "node:fs";
import initSqlJs from "sql.js/dist/sql-wasm-browser.js";
import { SqliteLegacyDatabase, bindLegacySql } from "../src/legacy/php/sqlite-database";
import { legacyRowFromJson, LegacyQueryResult } from "../src/legacy/php/database";

let SQL: Awaited<ReturnType<typeof initSqlJs>>;
beforeAll(async () => { SQL=await initSqlJs({wasmBinary:readFileSync('node_modules/sql.js/dist/sql-wasm-browser.wasm')}); });
const users=[{uid:1,username:'Alpha',gold:10,credits:20},{uid:2,username:'Beta',gold:30,credits:40}];
function database(){return new SqliteLegacyDatabase(new SQL.Database(),{acbra2_users:users.map(legacyRowFromJson)});}

describe('request-local original SQL',()=>{
  it('evaluates numeric predicates, ordering, projection, count and limits',()=>{
    const db=database();
    try {
      const selected=db.query("SELECT username,gold FROM acbra2_users WHERE gold>0 AND (username='Alpha' OR username='Beta') ORDER BY gold DESC LIMIT 1") as LegacyQueryResult;
      expect(selected.rows.map(r=>r.pairs())).toEqual([[['username','Beta'],['gold','30']]]);
      expect(db.result(db.query('SELECT COUNT(*) FROM acbra2_users WHERE gold>=10') as never,0)).toBe('2');
      expect(db.mutations()).toEqual([]);
    } finally {db.close();}
  });
  it('keeps escaped names and SQL-shaped content as bound data',()=>{
    const db=database();
    try {
      const value="O'Brien, AND gold=999; -- \\ tail";
      db.array_update('acbra2_users',legacyRowFromJson({username:value}),"uid='1'");
      expect(db.rows('acbra2_users')[0]?.get('username')).toBe(value);
      expect(db.rows('acbra2_users')[1]?.get('gold')).toBe('30');
      expect(()=>bindLegacySql("SELECT 'unterminated")).toThrow();
      expect(()=>db.query('SELECT 1; DELETE FROM acbra2_users')).toThrow();
    }finally{db.close();}
  });
  it('executes arithmetic, concatenation, INSERT SET and duplicate-key updates',()=>{
    const db=database();
    try {
      db.query("UPDATE acbra2_users SET gold=gold+5, motto=CONCAT(motto,'text') WHERE uid=1");
      db.query("INSERT INTO acbra2_users SET username='Gamma',gold='9'");
      expect(db.insert_id()).toBe(3);
      db.query("INSERT INTO acbra2_users(uid,username,gold) VALUES(3,'Gamma',100) ON DUPLICATE KEY UPDATE gold=101");
      expect(db.rows('acbra2_users').map(r=>[r.get('username'),r.get('gold')])).toEqual([['Alpha','15'],['Beta','30'],['Gamma','101']]);
      expect(db.mutations()).toHaveLength(2);
    }finally{db.close();}
  });
});
