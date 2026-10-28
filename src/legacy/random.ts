/** Inclusive integer RNG used in place of PHP rand(min, max). */
export interface LegacyRandom {
  int(min: number, max: number): number;
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
