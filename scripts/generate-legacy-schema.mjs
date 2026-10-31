#!/usr/bin/env node
/**
 * Translates the original's live MySQL schema into Postgres DDL.
 *
 * The input is scripts/reference/original-mysql-schema.json, dumped from
 * the running parity instance by scripts/php-schema-reference.php. That is
 * the authority rather than install/bra.install.sql, which is the schema
 * the game shipped with years ago: the live acbra2_users has 40 columns to
 * the install file's 20, so a port built from the install file would be
 * missing most of the account.
 *
 * The target is Postgres rather than D1, for a measured reason: D1 allows
 * at most 100 columns per table and the original's players table has 124,
 * which the create fails on outright. Splitting it would mean the adapter
 * rewriting the original's own SELECT * and UPDATE statements, which is
 * the one place this port cannot afford a translation layer. Postgres
 * allows 1,600 columns, so the original's tables go in unchanged.
 *
 * The translation is by rule and refuses anything it does not recognise,
 * so a column type that needs thought fails the build instead of being
 * guessed at.
 *
 * Usage: node scripts/generate-legacy-schema.mjs [--check]
 *   --check  fail if the generated file is out of date, for CI
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const INPUT = join(repoRoot, "scripts/reference/original-mysql-schema.json");
const OUTPUT = join(repoRoot, "src/generated/legacy-schema.sql");
const TABLE_LIST = join(repoRoot, "src/generated/legacy-tables.ts");

/**
 * MySQL integer families all become bigint.
 *
 * bigint rather than integer because MySQL's `int(10) unsigned` reaches
 * 4,294,967,295 and Postgres's integer stops at 2,147,483,647, so a
 * narrower type could reject a value the original accepts. The widths and
 * `unsigned` are otherwise dropped, which loses two MySQL behaviours: a
 * write past the range is clamped by MySQL and rejected by Postgres, and
 * a negative written to an unsigned column becomes 0 in MySQL. The
 * original writes neither -- its values are bounded by the gameplay that
 * produces them -- so this is recorded rather than emulated.
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
  if (INTEGER_TYPES.test(type)) sqliteType = "bigint";
  else if (TEXT_TYPES.test(type) || BLOB_TEXT_TYPES.test(type)) sqliteType = "text";
  else throw new Error(`No rule for column type "${type}" on \`${name}\`; refusing to guess.`);

  let defaultValue = defaulted ? defaulted[1] : null;
  if (defaultValue !== null && sqliteType === "bigint") {
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
    // INSERT. Postgres would reject the row instead, so the implicit
    // default is made explicit here. Without this, creating a player
    // fails on the first text column the original leaves out.
    defaultValue = sqliteType === "bigint" ? "0" : "''";
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
    // Postgres spells AUTO_INCREMENT as an identity column, which also
    // carries the primary key inline, so the table-level PRIMARY KEY
    // clause is dropped for it.
    if (column === auto) {
      return `  "${column.name}" bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY`;
    }
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
        `(${primaryKey.join(", ")}); Postgres cannot express that.`
    );
  }

  statements.push(`CREATE TABLE IF NOT EXISTS "${tableName}" (\n${body.join(",\n")}\n);`);
  for (const index of indexes) {
    // MySQL index names are scoped to their table and repeat across the
    // per-server copies (every *_players has a KEY named NAME), while
    // Postgres's share one namespace per schema, so the table name is
    // prefixed.
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
  "-- Generated by scripts/generate-legacy-schema.mjs. Do not hand edit.",
  "--",
  "-- Translated from the original's live MySQL schema, dumped from the",
  "-- running parity instance. Column names, order and defaults are the",
  "-- original's; only the types are restated in Postgres's vocabulary.",
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
    console.error("src/generated/legacy-schema.sql is out of date; run npm run generate:schema.");
    process.exit(1);
  }
  console.log(`legacy-schema.sql is up to date (${tables.length} tables).`);
} else {
  writeFileSync(OUTPUT, text);
  // The same table names as TypeScript, so code and tests can enumerate
  // them without reading the .sql at run time: the Worker has no file
  // system, and the test tsconfig has no node types.
  writeFileSync(
    TABLE_LIST,
    "/* Generated by scripts/generate-legacy-schema.mjs. Do not hand edit. */\n" +
      "/** Every table the original has, as named in the live database. */\n" +
      "export const LEGACY_TABLES = [\n" +
      tables.map(([name]) => `  ${JSON.stringify(name)}`).join(",\n") +
      "\n] as const;\n"
  );
  console.log(
    `Wrote ${OUTPUT.replace(repoRoot + "/", "")}: ${tables.length} tables, ${columnCount} columns.`
  );
}
