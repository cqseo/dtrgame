import { describe, expect, it } from "vitest";
import { MAX_MESSAGE_BYTES, isValidCommandId, isValidPlayerId, isValidRoomId, parseClientMessage } from "../src/protocol";

describe("room protocol", () => {
  it("accepts safe room ids only", () => {
    expect(isValidRoomId("room_2026-01")).toBe(true);
    expect(isValidRoomId("../admin")).toBe(false);
    expect(isValidRoomId("")).toBe(false);
  });
  it("parses supported messages", () => {
    expect(parseClientMessage('{"type":"ping","at":42}')).toEqual({ type: "ping", at: 42 });
    expect(parseClientMessage(JSON.stringify({ type: "auth", accessToken: "a".repeat(64) }))).toEqual({ type: "auth", accessToken: "a".repeat(64) });
    expect(parseClientMessage('{"type":"action","commandId":"player_01:7","action":"move","payload":{"x":1}}')).toEqual({
      type: "action",
      commandId: "player_01:7",
      action: "move",
      payload: { x: 1 }
    });
  });
  it("validates player and command identifiers", () => {
    expect(isValidPlayerId("player_01")).toBe(true);
    expect(isValidPlayerId("player/01")).toBe(false);
    expect(isValidCommandId("player_01:42")).toBe(true);
    expect(isValidCommandId("bad command")).toBe(false);
  });
  it("rejects malformed and oversized messages", () => {
    expect(parseClientMessage("not-json")).toBeNull();
    expect(parseClientMessage(JSON.stringify({ type: "unknown" }))).toBeNull();
    expect(parseClientMessage('{"type":"auth","accessToken":"short"}')).toBeNull();
    expect(parseClientMessage('{"type":"action","action":"move"}')).toBeNull();
    expect(parseClientMessage("x".repeat(MAX_MESSAGE_BYTES + 1))).toBeNull();
  });
});
