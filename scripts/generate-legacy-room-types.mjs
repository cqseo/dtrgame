import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const legacyRoot = resolve(process.argv[2] ?? "../legacy-dts");
const outputPath = resolve(process.argv[3] ?? "src/generated/legacy-room-types.ts");
const php = process.env.PHP_BIN ?? "php";
const extractor = resolve("scripts/extract-legacy-room-types.php");
const result = spawnSync(php, [extractor, legacyRoot], { encoding: "utf8" });

if (result.status !== 0) {
  process.stderr.write(result.stderr || `PHP extractor exited with ${result.status}\n`);
  process.exit(result.status ?? 1);
}

const data = JSON.parse(result.stdout);
const generated = `/** Generated from include/roommng/roommng.config.php. Do not edit by hand. */\n` +
  `export const LEGACY_ROOM_CONFIGURATION = ${JSON.stringify(data, null, 2)} as const;\n`;

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, generated);
process.stdout.write(`Generated ${Object.keys(data.roomTypes).length} legacy room types -> ${outputPath}\n`);
