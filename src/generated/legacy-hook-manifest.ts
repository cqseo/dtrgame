/** Generated from module codelists and PHP tokenizer. Do not hand edit. */
import { LEGACY_HOOK_CHAINS_0 } from "./legacy-hook-manifest.chunks/chunk-000";
import { LEGACY_HOOK_CHAINS_1 } from "./legacy-hook-manifest.chunks/chunk-001";
import { LEGACY_HOOK_CHAINS_2 } from "./legacy-hook-manifest.chunks/chunk-002";
import { LEGACY_HOOK_CHAINS_3 } from "./legacy-hook-manifest.chunks/chunk-003";
import { LEGACY_HOOK_CHAINS_4 } from "./legacy-hook-manifest.chunks/chunk-004";
import { LEGACY_HOOK_CHAINS_5 } from "./legacy-hook-manifest.chunks/chunk-005";
import { LEGACY_HOOK_CHAINS_6 } from "./legacy-hook-manifest.chunks/chunk-006";
import { LEGACY_HOOK_CHAINS_7 } from "./legacy-hook-manifest.chunks/chunk-007";
import { LEGACY_HOOK_CHAINS_8 } from "./legacy-hook-manifest.chunks/chunk-008";
import { LEGACY_HOOK_CHAINS_9 } from "./legacy-hook-manifest.chunks/chunk-009";
import { LEGACY_HOOK_CHAINS_10 } from "./legacy-hook-manifest.chunks/chunk-010";
import { LEGACY_HOOK_CHAINS_11 } from "./legacy-hook-manifest.chunks/chunk-011";
import { LEGACY_HOOK_CHAINS_12 } from "./legacy-hook-manifest.chunks/chunk-012";
import { LEGACY_HOOK_CHAINS_13 } from "./legacy-hook-manifest.chunks/chunk-013";
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
  ...LEGACY_HOOK_CHAINS_0,
  ...LEGACY_HOOK_CHAINS_1,
  ...LEGACY_HOOK_CHAINS_2,
  ...LEGACY_HOOK_CHAINS_3,
  ...LEGACY_HOOK_CHAINS_4,
  ...LEGACY_HOOK_CHAINS_5,
  ...LEGACY_HOOK_CHAINS_6,
  ...LEGACY_HOOK_CHAINS_7,
  ...LEGACY_HOOK_CHAINS_8,
  ...LEGACY_HOOK_CHAINS_9,
  ...LEGACY_HOOK_CHAINS_10,
  ...LEGACY_HOOK_CHAINS_11,
  ...LEGACY_HOOK_CHAINS_12,
  ...LEGACY_HOOK_CHAINS_13
} as const;
export const LEGACY_HOOK_MANIFEST_SUMMARY = {
  "enabledModules": 735,
  "functionNames": 3211,
  "implementations": 5235,
  "overloadedFunctions": 505,
  "missingCodelistSources": 0
} as const;
