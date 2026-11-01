#!/usr/bin/env node
/**
 * Vitest memory-safe runner for the original DTS port.
 * Test files are batched into fresh Node processes to avoid cumulative heap
 * growth from the generated PHP module corpus. Failing batches retry each
 * file separately with a larger, still bounded heap before reporting failure.
 * Never deploys or modifies any game state.
 */
import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
// 2 GiB test hosts cannot reliably compile four large legacy modules at once.
// Run one file per process unless an adequately sized runner opts into batches.
const batchSize = Number(process.env.DTS_TEST_BATCH_SIZE ?? 1);
const heapMb = Number(process.env.DTS_TEST_HEAP_MB ?? 640);
const retryHeapMb = Number(process.env.DTS_TEST_RETRY_HEAP_MB ?? 768);
const legal = (value, min, max) => Number.isSafeInteger(value) && value >= min && value <= max;
if (!legal(batchSize, 1, 20) || !legal(heapMb, 128, 1536) || !legal(retryHeapMb, 128, 1536)) {
  console.error("Invalid test batch or heap setting (batch 1-20, heap 128-1536 MiB).");
  process.exit(2);
}
const filters = (process.env.DTS_TEST_FILE_FILTER ?? "").split(",").map(s => s.trim()).filter(Boolean);
const files = readdirSync(resolve(root, "test"))
  .filter(name => /\.test\.(ts|mjs)$/.test(name))
  .sort()
  .map(name => `test/${name}`)
  .filter(name => filters.length === 0 || filters.some(filter => name.includes(filter)));
if (files.length === 0) {
  console.error("No test files matched the requested filter.");
  process.exit(2);
}
const batches = [];
for (let i = 0; i < files.length; i += batchSize) batches.push(files.slice(i, i + batchSize));

function runFiles(batch, heap) {
  const run = spawnSync(process.execPath, [
    resolve(root, "node_modules", "vitest", "vitest.mjs"),
    "run", ...batch, "--maxWorkers=1", "--no-file-parallelism"
  ], {
    cwd: root,
    env: { ...process.env, NODE_OPTIONS: `--max-old-space-size=${heap}` },
    timeout: 120000,
    stdio: "inherit"
  });
  return { passed: run.status === 0, reason: run.error?.message ?? run.signal ?? run.status };
}
let recoveredBatches = 0;
const failedFiles = [];
console.log(`Running ${files.length} test files in ${batches.length} fresh processes (heap ${heapMb} MiB, retry ${retryHeapMb} MiB).`);
for (const [i, batch] of batches.entries()) {
  console.log(`\n== Batch ${i + 1}/${batches.length}: ${batch.join(", ")} ==`);
  const primary = runFiles(batch, heapMb);
  if (primary.passed) continue;
  console.error(`Batch ${i + 1} did not pass (${primary.reason}); retrying each file independently.`);
  let recovered = true;
  for (const file of batch) {
    console.log(`\n== Single-file retry: ${file} ==`);
    const retry = runFiles([file], retryHeapMb);
    if (!retry.passed) {
      failedFiles.push(file);
      recovered = false;
      console.error(`FAILED ${file}: ${retry.reason}`);
    }
  }
  if (recovered) recoveredBatches++;
}
console.log(`\nResult: ${files.length - failedFiles.length}/${files.length} files passed; ${recoveredBatches} batches recovered by isolation; ${failedFiles.length} files failed.`);
if (failedFiles.length) console.error(`Remaining failures: ${failedFiles.join(", ")}`);
process.exitCode = failedFiles.length === 0 ? 0 : 1;
