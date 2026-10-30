#!/usr/bin/env node
/**
 * Copies the original's directly-servable files into the Worker asset bundle
 * and records a hash manifest.
 *
 * Which paths a browser can actually fetch was determined against the running
 * original, not guessed: /img/, /map/, /templates/, /include/javascript/ and
 * /gamedata/css/ answer 200, while the rest of /include/ and /gamedata/ are
 * refused by the edge. Templates are served as raw .htm by the original, so
 * they belong in the bundle too.
 *
 * The manifest lets test/original-assets.test.mjs prove byte parity without
 * needing the captured source present, which is what the release gate
 * "static asset hashes match" requires.
 *
 * Usage: node scripts/sync-original-assets.mjs [legacyRoot] [publicDir]
 */
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const legacyRoot = resolve(process.argv[2] ?? "../legacy-dts");
const publicDir = resolve(process.argv[3] ?? "public");
const manifestPath = resolve("test/fixtures/original-asset-manifest.json");

/** Directories the original serves verbatim. */
const DIRECTORIES = ["img", "map", "templates", "include/javascript", "gamedata/css"];

/** Root files the browser requests directly. */
const ROOT_FILES = [
  "favicon.ico",
  "favicon-16x16.png",
  "favicon-32x32.png",
  "apple-touch-icon.png",
  "android-chrome-192x192.png",
  "android-chrome-512x512.png",
  "site.webmanifest"
];

/**
 * .php files inside those directories are executed by the original, not sent.
 * templates/default/templates.lang.php answers 200 with an empty body there;
 * shipping it as a static asset would serve its source instead, which both
 * breaks parity and discloses code.
 */
const isServable = path => !path.toLowerCase().endsWith(".php");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });

for (const dir of DIRECTORIES) {
  const from = join(legacyRoot, dir);
  try {
    statSync(from);
  } catch {
    console.error(`missing in captured source: ${dir}`);
    process.exit(1);
  }
  cpSync(from, join(publicDir, dir), { recursive: true, filter: isServable });
}

for (const stray of walk(publicDir).filter(file => !isServable(file))) rmSync(stray);

let rootCopied = 0;
for (const file of ROOT_FILES) {
  try {
    cpSync(join(legacyRoot, file), join(publicDir, file));
    rootCopied += 1;
  } catch {
    // Not every install ships every icon; the manifest records what exists.
  }
}

const manifest = {};
for (const file of walk(publicDir).sort()) {
  const bytes = readFileSync(file);
  manifest[`/${relative(publicDir, file).split("\\").join("/")}`] = {
    sha256: createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length
  };
}

mkdirSync(resolve("test/fixtures"), { recursive: true });
writeFileSync(manifestPath, `${JSON.stringify({ files: Object.keys(manifest).length, manifest }, null, 2)}\n`);

const total = Object.values(manifest).reduce((sum, entry) => sum + entry.bytes, 0);
console.log(
  `${Object.keys(manifest).length} original files (${(total / 1024 / 1024).toFixed(1)} MB) ` +
    `copied to ${relative(process.cwd(), publicDir)}, ${rootCopied} root icons`
);
