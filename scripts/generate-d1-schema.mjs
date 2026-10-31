#!/usr/bin/env node
/**
 * Translates the original's live MySQL schema into SQLite DDL for D1.
 *
 * The input is scripts/reference/original-mysql-schema.json, dumped from
 * the running parity instance by scripts/php-schema-reference.php. That is
 * the authority rather than install/bra.install.sql, which is the schema
 * the game shipped with years ago: the live acbra2_users has 40 columns to
 * the install file's 20, so a port built from the install file would be
 * missing most of the account.
 *
 * The translation is by rule and refuses anything it does not recognise,
 * so a column type that needs thought fails the build instead of being
 * guessed at.
 *
 * Usage: node scripts/generate-d1-schema.mjs [--check]
 *   --check  fail if the generated file is out of date, for CI
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INPUT = join(repoRoot, "scripts/reference/original-mysql-schema.json");
const OUTPUT = join(repoRoot, "src/generated/legacy-schema.sql");

/**
 * MySQL integer families all become INTEGER.
 *
 * SQLite has one integer type, so the widths and `unsigned` are dropped.
 * That loses two MySQL behaviours: a write past the column's range is
 * clamped by MySQL and stored as-is by SQLite, and a negative written to
 * an unsigned column becomes 0 in MySQL. The original does not write
 * either case -- its values are bounded by the gameplay that produces
 * them -- so this is recorded rather than emulated, which would need a
 * trigger per column.
 */
const INTEGER_TYPES = /^(tinyint|smallint|mediumint|int|bigint)\(\d+\)( unsigned)?$/;
/** char/varchar become TEXT: SQLite does not pad or truncate to a width. */
const TEXT_TYPES = /^(char|varchar)\(\d+\)$/;
const BLOB_TEXT_TYPES = /^(tinytext|text|mediumtext|longtext)$/;

function parseColumn(line) {
  const match = /^`([^`]+)`\s+(.+?)\s*,?$/.exec(line.trim());
  if (!match) throw new Error(`Unrecognised column definition: ${line}`);
  const name = match[1];
  let rest = match[2];

  const autoIncrement = /\bAUTO_INCREMENT\b/i.test(rest);
  rest = rest.replace(/\s*\bAUTO_INCREMENT\b/i, "");

  const notNull = /\bNOT NULL\b/i.test(rest);
  rest = rest.replace(/\s*\bNOT NULL\b/i, "");

  const defaulted = /\bDEFAULT\s+('(?:[^'\\]|\\.)*'|[A-Za-z0-9_]+)/i.exec(rest);
  rest = rest.replace(/\s*\bDEFAULT\s+('(?:[^'\\]|\\.)*'|[A-Za-z0-9_]+)/i, "");

  const type = rest.trim();
  let sqliteType;
  if (INTEGER_TYPES.test(type)) sqliteType = "INTEGER";
  else if (TEXT_TYPES.test(type) || BLOB_TEXT_TYPES.test(type)) sqliteType = "TEXT";
  else throw new Error(`No rule for column type "${type}" on \`${name}\`; refusing to guess.`);

  let defaultValue = defaulted ? defaulted[1] : null;
  if (defaultValue !== null && sqliteType === "INTEGER") {
    // MySQL writes integer defaults as quoted strings: DEFAULT '0'.
    const unquoted = defaultValue.replace(/^'|'$/g, "");
    if (!/^-?\d+$/.test(unquoted)) {
      throw new Error(`Non-numeric default ${defaultValue} on integer \`${name}\`.`);
    }
    defaultValue = unquoted;
  }
  if (defaultValue === null && notNull) {
    // MyISAM with strict mode off accepts an INSERT that omits a NOT NULL
    // column and stores the type's implicit default; the original relies
    // on that for every `text NOT NULL` column it never names in an
    // INSERT. SQLite would reject the row instead, so the implicit
    // default is made explicit here. Without this, creating a player
    // fails on the first text column the original leaves out.
    defaultValue = sqliteType === "INTEGER" ? "0" : "''";
  }

  return { name, sqliteType, notNull, defaultValue, autoIncrement };
}

function translate(tableName, ddl) {
  const lines = ddl.split("\n");
  const columns = [];
  const indexes = [];
  let primaryKey = null;

  for (const raw of lines.slice(1)) {
    const line = raw.trim();
    if (line === "" || line.startsWith("CREATE TABLE") || line.startsWith(")")) continue;

    const pk = /^PRIMARY KEY \((.+?)\)\s*,?$/i.exec(line);
    if (pk) {
      primaryKey = pk[1].split(",").map(part => part.trim().replace(/`/g, ""));
      continue;
    }
    const key = /^(UNIQUE )?KEY `([^`]+)` \((.+?)\)\s*,?$/i.exec(line);
    if (key) {
      indexes.push({
        unique: Boolean(key[1]),
        name: key[2],
        columns: key[3].split(",").map(part => part.trim().replace(/`/g, ""))
      });
      continue;
    }
    if (line.startsWith("`")) {
      columns.push(parseColumn(line));
      continue;
    }
    throw new Error(`Unrecognised line in ${tableName}: ${line}`);
  }

  const auto = columns.find(column => column.autoIncrement);
  const statements = [];
  const body = columns.map(column => {
    // SQLite only auto-assigns for a column declared exactly as
    // `INTEGER PRIMARY KEY AUTOINCREMENT`, so that column carries the
    // primary key inline and the table-level PRIMARY KEY clause is
    // dropped for it.
    if (column === auto) return `  "${column.name}" INTEGER PRIMARY KEY AUTOINCREMENT`;
    const parts = [`  "${column.name}"`, column.sqliteType];
    if (column.notNull) parts.push("NOT NULL");
    if (column.defaultValue !== null) parts.push(`DEFAULT ${column.defaultValue}`);
    return parts.join(" ");
  });

  if (primaryKey && !auto) {
    body.push(`  PRIMARY KEY (${primaryKey.map(name => `"${name}"`).join(", ")})`);
  } else if (primaryKey && auto && !(primaryKey.length === 1 && primaryKey[0] === auto.name)) {
    throw new Error(
      `${tableName} has AUTO_INCREMENT on \`${auto.name}\` but a primary key of ` +
        `(${primaryKey.join(", ")}); SQLite cannot express that.`
    );
  }

  statements.push(`CREATE TABLE IF NOT EXISTS "${tableName}" (\n${body.join(",\n")}\n);`);
  for (const index of indexes) {
    // MySQL index names are scoped to their table and repeat across the
    // per-server copies (every *_players has a KEY named NAME), while
    // SQLite's are database-wide, so the table name is prefixed.
    statements.push(
      `CREATE ${index.unique ? "UNIQUE " : ""}INDEX IF NOT EXISTS ` +
        `"${tableName}_${index.name}" ON "${tableName}" ` +
        `(${index.columns.map(name => `"${name}"`).join(", ")});`
    );
  }
  return statements;
}

const schema = JSON.parse(readFileSync(INPUT, "utf8"));
const tables = Object.entries(schema.tables).sort(([a], [b]) => a.localeCompare(b));

const out = [
  "-- Generated by scripts/generate-d1-schema.mjs. Do not hand edit.",
  "--",
  "-- Translated from the original's live MySQL schema, dumped from the",
  "-- running parity instance. Column names, order and defaults are the",
  "-- original's; only the types are restated in SQLite's vocabulary.",
  `-- ${tables.length} tables, prefix ${schema.tablepre}.`,
  ""
];

let columnCount = 0;
for (const [name, ddl] of tables) {
  out.push(...translate(name, ddl), "");
  columnCount += ddl.split("\n").filter(line => line.trim().startsWith("`")).length;
}

const text = out.join("\n");

if (process.argv.includes("--check")) {
  const existing = readFileSync(OUTPUT, "utf8");
  if (existing !== text) {
    console.error("src/generated/legacy-schema.sql is out of date; run npm run generate:d1-schema.");
    process.exit(1);
  }
  console.log(`legacy-schema.sql is up to date (${tables.length} tables).`);
} else {
  writeFileSync(OUTPUT, text);
  console.log(
    `Wrote ${OUTPUT.replace(repoRoot + "/", "")}: ${tables.length} tables, ${columnCount} columns.`
  );
}
