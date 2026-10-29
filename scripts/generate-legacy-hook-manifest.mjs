#!/usr/bin/env node
import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";

const execute = promisify(execFile);
const root = resolve(process.argv[2] ?? "../legacy-dts");
const output = resolve(process.argv[3] ?? "src/generated/legacy-hook-manifest.ts");
const php = process.env.DTS_PHP_BIN ?? "php";
const tokenizer = process.env.DTS_PHP_TOKENIZER;
const phpArgs = [];
if (tokenizer) phpArgs.push("-d", `extension=${tokenizer}`);
phpArgs.push(resolve("scripts/extract-legacy-hooks.php"), root);
const { stdout } = await execute(php, phpArgs, { maxBuffer: 64 * 1024 * 1024 });
const document = JSON.parse(stdout);
const chains = {};
let implementationCount = 0;
for (const module of document.modules) {
  for (const implementation of module.functions) {
    implementationCount += 1;
    (chains[implementation.name] ??= []).push({
      module: module.name,
      order: module.order,
      source: implementation.source,
      line: implementation.line,
      parameters: implementation.parameters
    });
  }
}
const overloaded = Object.values(chains).filter((chain) => chain.length > 1).length;
const chunks = [];
let currentChunk = {};
let currentSize = 0;
const maxChunkSize = 180_000;
for (const [functionName, chain] of Object.entries(chains)) {
  const entrySize = JSON.stringify({ [functionName]: chain }, null, 2).length;
  if (currentSize && currentSize + entrySize > maxChunkSize) {
    chunks.push(currentChunk);
    currentChunk = {};
    currentSize = 0;
  }
  currentChunk[functionName] = chain;
  currentSize += entrySize;
}
if (Object.keys(currentChunk).length) chunks.push(currentChunk);
const outputDirectory = dirname(output);
const chunkDirectoryName = "legacy-hook-manifest.chunks";
const chunkDirectory = resolve(outputDirectory, chunkDirectoryName);
await mkdir(chunkDirectory, { recursive: true });
await Promise.all(chunks.map((chunk, index) => writeFile(
  resolve(chunkDirectory, `chunk-${String(index).padStart(3, "0")}.ts`),
  `/** Generated legacy hook manifest fragment. Do not hand edit. */\nexport const LEGACY_HOOK_CHAINS_${index} = ${JSON.stringify(chunk, null, 2)} as const;\n`
)));
const imports = chunks.map((_chunk, index) => `import { LEGACY_HOOK_CHAINS_${index} } from "./${chunkDirectoryName}/chunk-${String(index).padStart(3, "0")}";`).join("\n");
const spreads = chunks.map((_chunk, index) => `  ...LEGACY_HOOK_CHAINS_${index}`).join(",\n");
const generated = `/** Generated from module codelists and PHP tokenizer. Do not hand edit. */
${imports}
export interface LegacyHookManifestEntry {
  readonly module: string;
  readonly order: number;
  readonly source: string;
  readonly line: number;
  readonly parameters: readonly {
    readonly name: string;
    readonly byReference: boolean;
    readonly variadic: boolean;
    readonly optional: boolean;
  }[];
}
export const LEGACY_HOOK_CHAINS = {
${spreads}
} as const;
export const LEGACY_HOOK_MANIFEST_SUMMARY = ${JSON.stringify({
  enabledModules: document.modules.filter((module) => module.enabled).length,
  functionNames: Object.keys(chains).length,
  implementations: implementationCount,
  overloadedFunctions: overloaded
  , missingCodelistSources: document.missingSources.length
}, null, 2)} as const;
`;
await mkdir(outputDirectory, { recursive: true });
await writeFile(output, generated);
console.log(`Generated ${Object.keys(chains).length} hook chains (${implementationCount} implementations, ${overloaded} overloaded) in ${chunks.length} fragments at ${output}`);
