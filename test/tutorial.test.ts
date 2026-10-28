import { describe, expect, it } from "vitest";
import { applyTutorialAction } from "../src/tutorial";

describe("tutorial engine", () => {
  it("runs the deterministic movement, search and item lesson", () => {
    let result = applyTutorialAction(undefined, "tutorial_start", undefined);
    expect(result.state.step).toBe(0);
    result = applyTutorialAction(result.state, "tutorial_move", { to: "旧站台" });
    expect(result.state.sp).toBe(105);
    result = applyTutorialAction(result.state, "tutorial_search", undefined);
    expect(result.state.pendingItem?.id).toBe("insulated_bracer");
    result = applyTutorialAction(result.state, "tutorial_pickup", undefined);
    result = applyTutorialAction(result.state, "tutorial_search", undefined);
    result = applyTutorialAction(result.state, "tutorial_pickup", undefined);
    result = applyTutorialAction(result.state, "tutorial_use_ration", undefined);
    expect(result.state.status).toBe("poisoned");
    expect(result.state.hp).toBe(80);
    result = applyTutorialAction(result.state, "tutorial_use_purifier", undefined);
    expect(result.state.completed).toBe(true);
    expect(result.state.status).toBe("normal");
  });

  it("rejects out-of-order actions without changing state", () => {
    const started = applyTutorialAction(undefined, "tutorial_start", undefined).state;
    const result = applyTutorialAction(started, "tutorial_search", undefined);
    expect(result.ok).toBe(false);
    expect(result.state).toEqual(started);
  });
});
