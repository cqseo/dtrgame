import { describe, expect, it } from "vitest";
import { MAX_MESSAGE_BYTES, isValidRoomId, parseClientMessage } from "../src/protocol";

describe("room protocol", () => {
  it("accepts safe room ids only", () => {
    expect(isValidRoomId("room_2026-01")).toBe(true);
    expect(isValidRoomId("../admin")).toBe(false);
    expect(isValidRoomId("")).toBe(false);
  });
  it("parses supported messages", () => {
    expect(parseClientMessage('{"type":"ping","at":42}')).toEqual({ type: "ping", at: 42 });
    expect(parseClientMessage('{"type":"action","action":"move","payload":{"x":1}}')).toEqual({ type: "action", action: "move", payload: { x: 1 } });
  });
  it("rejects malformed and oversized messages", () => {
    expect(parseClientMessage("not-json")).toBeNull();
    expect(parseClientMessage(JSON.stringify({ type: "unknown" }))).toBeNull();
    expect(parseClientMessage("x".repeat(MAX_MESSAGE_BYTES + 1))).toBeNull();
  });
});
