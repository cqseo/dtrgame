import initSqlJs from "sql.js/dist/sql-wasm-browser.js";
import sqliteModule from "../../node_modules/sql.js/dist/sql-wasm-browser.wasm";
import { SqliteLegacyDatabase } from "../legacy/php/sqlite-database";
import type { PhpArray } from "../legacy/template/values";

// Compile-time Wasm import: Cloudflare forbids compiling arbitrary Wasm
// binaries on a request. No filesystem/network loader or dynamic evaluation.
let engine:ReturnType<typeof initSqlJs>|undefined;

export async function createSqliteShadow(tables: Readonly<Record<string, readonly PhpArray[]>>,counters:Readonly<Record<string,number>>={}) {
  const SQL = await (engine??=initSqlJs({instantiateWasm(imports,receive){
    const instance=new WebAssembly.Instance(sqliteModule,imports);receive(instance);return instance.exports;
  }}));
  return new SqliteLegacyDatabase(new SQL.Database(), tables,counters);
}
