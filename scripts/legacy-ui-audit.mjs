#!/usr/bin/env node
/**
 * Test one side of exact original UI preservation.
 * Usage:
 *   node scripts/legacy-ui-audit.mjs <canonical-manifest.json> <candidate-ui-root>
 *
 * No network, no writes to the old site, no PHP execution.
 * Reports missing/modified byte-identical templates, styles, scripts and assets.
 * Visual/dynamic HTML equivalence must be tested separately.
 */
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, sep } from "node:path";
import process from "node:process";

const [manifestArg, candidateArg] = process.argv.slice(2);
if (!manifestArg || !candidateArg) {
  console.error("Usage: node scripts/legacy-ui-audit.mjs <manifest.json> <candidate-root>");
  process.exit(2);
}
const manifest = JSON.parse(await readFile(resolve(manifestArg), "utf8"));
if (!Array.isArray(manifest.files)) throw new Error("Invalid UI baseline manifest");
const candidateRoot = resolve(candidateArg);
const failures = [];
let matched = 0;
let totalBytes = 0;
for (const file of manifest.files) {
  if (!file.path || file.path.startsWith("/") || file.path.split("/").includes("..")) {
    throw new Error("Unsafe manifest file path");
  }
  const path = resolve(candidateRoot, file.path);
  if (!path.startsWith(candidateRoot + sep)) throw new Error("Unsafe resolved candidate path");
  try {
    const info = await stat(path);
    if (!info.isFile() || info.size !== file.bytes) {
      failures.push({ path: file.path, reason: "size_changed_or_not_file", originalBytes: file.bytes, actualBytes: info.size });
      continue;
    }
    const digest = createHash("sha256").update(await readFile(path)).digest("hex");
    if (digest !== file.sha256) {
      failures.push({ path: file.path, reason: "sha256_mismatch" });
      continue;
    }
    matched++;
    totalBytes += info.size;
  } catch (error) {
    failures.push({ path: file.path, reason: error?.code ?? String(error) });
  }
}
const report = {
  originalEntries: manifest.files.length,
  exactMatches: matched,
  missingOrChanged: failures.length,
  exactBytes: totalBytes,
  sampleFailures: failures.slice(0, 30),
  status: failures.length === 0 ? "PASS" : "FAIL"
};
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
