#!/usr/bin/env node
/**
 * Creates the original's tables in Supabase.
 *
 * Reads src/generated/legacy-schema.sql, which
 * scripts/generate-legacy-schema.mjs translates from the live MySQL DDL,
 * and applies it through Supabase's management API.
 *
 * Credentials come from tools/.supabase.local, which is untracked
 * because this repository is public. Nothing here prints them.
 *
 * Every statement is CREATE TABLE IF NOT EXISTS or CREATE INDEX IF NOT
 * EXISTS, so running it twice changes nothing. It never drops or alters
 * anything already there: the project also holds tables from other work,
 * and those are left alone.
 *
 * Usage: node scripts/apply-legacy-schema.mjs [--dry-run]
 *
 * Behind an egress proxy, add --use-env-proxy:
 *   node --use-env-proxy scripts/apply-legacy-schema.mjs
 * Node's fetch ignores HTTPS_PROXY unless told to read it, and the
 * failure it gives otherwise is a bare "fetch failed".
 */
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readCredentials() {
  const path = join(repoRoot, "tools/.supabase.local");
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(
      "tools/.supabase.local is missing. It holds SUPABASE_ACCESS_TOKEN and\n" +
        "SUPABASE_PROJECT_REF, and is untracked because this repository is public."
    );
    process.exit(1);
  }
  const values = {};
  for (const line of text.split("\n")) {
    const match = /^([A-Z_]+)=(.*)$/.exec(line.trim());
    if (match) values[match[1]] = match[2];
  }
  for (const name of ["SUPABASE_ACCESS_TOKEN", "SUPABASE_PROJECT_REF"]) {
    if (!values[name]) {
      console.error(`tools/.supabase.local has no ${name}.`);
      process.exit(1);
    }
  }
  return values;
}

/**
 * Splits the file into statements.
 *
 * The generated DDL has no string literal containing a semicolon --
 * every default is '' or a number -- so splitting on ";\n" is exact for
 * this file. A hand-written one would need a real lexer.
 */
function statementsOf(sql) {
  return sql
    .split(/;\s*\n/)
    .map(statement => statement.replace(/^\s*--.*$/gm, "").trim())
    .filter(statement => statement.length > 0);
}

const credentials = readCredentials();
const sql = readFileSync(join(repoRoot, "src/generated/legacy-schema.sql"), "utf8");
const statements = statementsOf(sql);
const tables = statements.filter(statement => statement.startsWith("CREATE TABLE")).length;

console.log(
  `${statements.length} statements: ${tables} tables, ${statements.length - tables} indexes.`
);

if (process.argv.includes("--dry-run")) {
  console.log("--dry-run: nothing sent.");
  process.exit(0);
}

const endpoint =
  `https://api.supabase.com/v1/projects/${credentials.SUPABASE_PROJECT_REF}/database/query`;

async function run(query) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${credentials.SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query })
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${(await response.text()).slice(0, 500)}`);
  }
  return response.json();
}

// In batches, so a failure names a handful of statements rather than all
// 115, and so no single request carries the whole file.
const BATCH = 10;
let done = 0;
for (let index = 0; index < statements.length; index += BATCH) {
  const batch = statements.slice(index, index + BATCH);
  try {
    await run(batch.join(";\n") + ";");
    done += batch.length;
    process.stdout.write(`\r  applied ${done}/${statements.length}`);
  } catch (error) {
    console.error(`\nFailed on the batch starting at statement ${index + 1}:`);
    console.error(`  ${batch[0]?.split("\n")[0]}`);
    console.error(String(error.message));
    process.exit(1);
  }
}

const check = await run(
  "select count(*)::int as n from information_schema.tables " +
    "where table_schema = 'public' and table_name like 'acbra2!_%' escape '!'"
);
console.log(`\nDone. acbra2_ tables present: ${check[0]?.n}`);
