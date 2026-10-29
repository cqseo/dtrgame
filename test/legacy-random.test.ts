import { describe, expect, it } from "vitest";
import { SequenceLegacyRandom } from "../src/legacy/random";

describe("deterministic legacy random source", () => {
  it("replays and restores the original inclusive rolls", () => {
    const random = new SequenceLegacyRandom([0, 10, 4]);
    expect(random.int(0, 10)).toBe(0);
    const checkpoint = random.snapshot();
    expect(random.int(0, 10)).toBe(10);
    random.restore(checkpoint);
    expect(random.int(0, 10)).toBe(10);
    expect(random.int(4, 4)).toBe(4);
    expect(random.consumed).toBe(3);
  });
});
