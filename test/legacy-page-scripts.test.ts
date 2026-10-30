import { describe, expect, it } from "vitest";
// @ts-expect-error test-only Node builtins
import { existsSync, readFileSync, readdirSync } from "node:fs";
// @ts-expect-error test-only Node builtins
import { join } from "node:path";
import { parseModuleFile } from "../src/legacy/php/parser";

/**
 * Checks the parser still reads the original's page scripts.
 *
 * The module tree is covered by scripts/probe-module-parser.mjs; these are
 * the entry points beside it — index.php, command.php, game.php and the
 * rest — and they are what the remaining routes are made of. command.php
 * in particular wraps its whole request in try/catch, which no module
 * does, so it is the one that would silently stop parsing if that support
 * were lost.
 */
const LEGACY = "../legacy-dts";

describe.skipIf(!existsSync(LEGACY))("original page scripts", () => {
  const scripts = readdirSync(LEGACY)
    .filter((name: string) => name.endsWith(".php"))
    .sort();

  it("parses every one of them", () => {
    const failures: string[] = [];
    for (const name of scripts) {
      try {
        parseModuleFile(readFileSync(join(LEGACY, name), "utf8"));
      } catch (error) {
        failures.push(`${name}: ${(error as Error).message}`);
      }
    }
    expect(failures).toEqual([]);
    // A ratchet on the count as well, so a scripts directory that silently
    // stopped being found cannot pass as "nothing failed".
    expect(scripts.length).toBeGreaterThanOrEqual(41);
  });

  it("reads command.php, which is the only one with try/catch", () => {
    const program = parseModuleFile(readFileSync(join(LEGACY, "command.php"), "utf8"));
    const kinds = new Set<string>();
    const walk = (statements: readonly { kind: string; [key: string]: unknown }[]): void => {
      for (const statement of statements) {
        kinds.add(statement.kind);
        for (const value of Object.values(statement)) {
          if (Array.isArray(value) && value.length > 0 && typeof value[0] === "object") {
            walk(value as never);
          }
        }
      }
    };
    walk(program as never);
    expect(kinds.has("try")).toBe(true);
  });
});
