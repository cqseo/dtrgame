import { describe,it,expect } from "vitest";
import { assertSourceTable, assertSchemaColumns, buildInsertSql, safeSnapshotEntry, assertDtsSupabaseUrl } from "../scripts/legacy-snapshot-core.mjs";
describe("Original private Supabase snapshot importer", () => {
 it("retains original table names and schema boundaries", () => {
  expect(assertSourceTable("acbra2_users")).toBe("users");
  expect(assertSourceTable("acbra2_s8_players")).toBe("s8_players");
  expect(buildInsertSql("acbra2_users",["uid","username"])).toContain("acfun_legacy");
 });
 it("checks source table identifiers and field count",()=>{
  expect(()=>assertSourceTable("users")).toThrow();
  expect(()=>assertSchemaColumns(["uid","username"],2)).not.toThrow();
  expect(()=>assertSchemaColumns(["uid"],2)).toThrow();
 });
 it("requires original SHA-256 and valid snapshot record counts",()=>{
  const e={table:"acbra2_users",rows:53,fields:39,sha256_jsonl:"a".repeat(64)};
  expect(safeSnapshotEntry(e)).toBe(e);
  expect(()=>safeSnapshotEntry({...e,rows:-1})).toThrow();
 });
 it("requires this exact Supabase project and a PostgreSQL URL",()=>{
  const url="postgresql://postgres:example@db.qtjcjmpapjsgrrgtfica.supabase.co/postgres";
  expect(assertDtsSupabaseUrl(url).hostname).toBe("db.qtjcjmpapjsgrrgtfica.supabase.co");
  expect(()=>assertDtsSupabaseUrl("postgresql://postgres:example@db.other.supabase.co/postgres")).toThrow();
 });
});