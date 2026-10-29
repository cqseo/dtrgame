/** Inclusive integer RNG used in place of PHP rand(min, max). */
export interface LegacyRandom {
  int(min: number, max: number): number;
}

/** Deterministic and rollback-capable source for parity tests and replays. */
export class SequenceLegacyRandom implements LegacyRandom {
  #index = 0;
  constructor(readonly values: readonly number[]) {}
  int(min: number, max: number): number {
    const value = this.values[this.#index++];
    if (value === undefined) throw new Error("Legacy RNG sequence exhausted.");
    return assertLegacyRandomResult(value, min, max);
  }
  snapshot(): unknown { return this.#index; }
  restore(snapshot: unknown): void {
    const index = Number(snapshot);
    if (!Number.isInteger(index) || index < 0 || index > this.values.length) throw new RangeError(`Invalid legacy RNG checkpoint: ${snapshot}`);
    this.#index = index;
  }
  get consumed(): number { return this.#index; }
}

export function assertLegacyRandomResult(value: number, min: number, max: number): number {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`Legacy RNG returned ${value}; expected an integer from ${min} to ${max}.`);
  }
  return value;
}

/** Cloudflare-compatible random source for live games. Replays inject their own source. */
export const cryptoLegacyRandom: LegacyRandom = {
  int(min, max) {
    if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
      throw new RangeError(`Invalid legacy RNG range: ${min}..${max}.`);
    }
    const span = max - min + 1;
    const ceiling = Math.floor(0x1_0000_0000 / span) * span;
    const buffer = new Uint32Array(1);
    let value = 0;
    do {
      crypto.getRandomValues(buffer);
      value = buffer[0]!;
    } while (value >= ceiling);
    return min + (value % span);
  }
};
