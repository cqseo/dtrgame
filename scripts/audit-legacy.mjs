import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { extname, join, relative, resolve } from "node:path";

const sourceRoot = resolve(process.argv[2] ?? "../legacy-dts");
const output = resolve(process.argv[3] ?? "docs/legacy-source-manifest.json");
const files = [];

async function walk(directory) {
  for (const name of await readdir(directory)) {
    if (name === ".git") continue;
    const absolute = join(directory, name);
    const info = await stat(absolute);
    if (info.isDirectory()) await walk(absolute);
    else {
      const body = await readFile(absolute);
      files.push({
        path: relative(sourceRoot, absolute).replaceAll("\\", "/"),
        bytes: info.size,
        sha256: createHash("sha256").update(body).digest("hex")
      });
    }
  }
}

await walk(sourceRoot);
files.sort((a, b) => a.path.localeCompare(b.path));
const byExtension = {};
for (const file of files) {
  const extension = extname(file.path).toLowerCase() || "[none]";
  byExtension[extension] = (byExtension[extension] ?? 0) + 1;
}
const modules = (await readFile(join(sourceRoot, "gamedata/modules.list.php"), "utf8"))
  .split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith("#"));
const manifest = {
  generatedAt: new Date().toISOString(),
  baseline: "ACFUN 大逃杀 legacy source",
  sourceRoot,
  fileCount: files.length,
  byteCount: files.reduce((sum, file) => sum + file.bytes, 0),
  enabledModuleCount: modules.filter((line) => line.split(",")[2]?.trim() === "1").length,
  byExtension,
  files
};
await writeFile(output, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Wrote ${output}: ${manifest.fileCount} files, ${manifest.enabledModuleCount} enabled modules.`);
