import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Byte parity for the original's presentation files.
 *
 * The contract's release gate requires the shipped assets to be the
 * original's own files, unchanged. The manifest is produced from the captured
 * source by `npm run sync:assets`; this checks the bundle against it, so the
 * gate holds without needing the captured source present.
 *
 * When ../legacy-dts is available the files are additionally compared against
 * the source itself, which catches a manifest regenerated from a drifted
 * bundle.
 */
const manifestPath = "test/fixtures/original-asset-manifest.json";
const publicDir = "public";
const legacyRoot = process.env.DTS_LEGACY_LOCAL ?? "../legacy-dts";

const { manifest } = JSON.parse(readFileSync(manifestPath, "utf8"));
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

describe("original presentation files", () => {
  it("ships the counts the contract enumerates", () => {
    const byExtension = {};
    for (const path of Object.keys(manifest)) {
      const ext = path.slice(path.lastIndexOf(".") + 1).toLowerCase();
      byExtension[ext] = (byExtension[ext] ?? 0) + 1;
    }
    // From ORIGINAL_GAME_1_TO_1_CONTRACT.md's inventory of the snapshot.
    expect(byExtension.png).toBe(389);
    expect(byExtension.gif).toBe(255);
    expect(byExtension.jpg).toBe(32);
    expect(byExtension.css).toBe(12);
    expect(byExtension.js).toBe(12);
  });

  it("serves no PHP source", () => {
    // The original executes these and returns an empty body; shipping them as
    // static files would disclose source and break parity.
    const php = Object.keys(manifest).filter(path => path.toLowerCase().endsWith(".php"));
    expect(php).toEqual([]);
  });

  it("ships the client the original's pages load", () => {
    expect(manifest["/include/javascript/game.20240318.js"]).toBeDefined();
    expect(manifest["/include/javascript/common.20240301.js"]).toBeDefined();
    expect(readFileSync(`${publicDir}/include/javascript/game.20240318.js`, "utf8")).toContain("postCmd(");
  });

  it("matches the manifest byte for byte, with nothing added or missing", () => {
    const onDisk = new Set(walk(publicDir).map(file => `/${relative(publicDir, file).split("\\").join("/")}`));
    const expected = new Set(Object.keys(manifest));

    const missing = [...expected].filter(path => !onDisk.has(path));
    const extra = [...onDisk].filter(path => !expected.has(path));
    expect(missing, "files in the manifest but not in the bundle").toEqual([]);
    expect(extra, "files in the bundle but not in the manifest").toEqual([]);

    const mismatched = [];
    for (const [path, entry] of Object.entries(manifest)) {
      const bytes = readFileSync(join(publicDir, path.slice(1)));
      if (bytes.length !== entry.bytes || sha256(bytes) !== entry.sha256) mismatched.push(path);
    }
    expect(mismatched).toEqual([]);
  });

  it.skipIf(!existsSync(legacyRoot))("matches the captured original source itself", () => {
    const drifted = [];
    for (const [path, entry] of Object.entries(manifest)) {
      const source = join(legacyRoot, path.slice(1));
      if (!existsSync(source) || !statSync(source).isFile()) {
        drifted.push(`${path} (absent from captured source)`);
        continue;
      }
      if (sha256(readFileSync(source)) !== entry.sha256) drifted.push(`${path} (hash differs)`);
    }
    expect(drifted).toEqual([]);
  });
});
