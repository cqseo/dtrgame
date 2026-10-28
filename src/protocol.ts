export const MAX_ROOM_ID_LENGTH = 48;
export const MAX_MESSAGE_BYTES = 8 * 1024;

export type ClientMessage =
  | { type: "join"; playerId: string }
  | { type: "action"; action: string; payload?: unknown }
  | { type: "ping"; at: number };

export function isValidRoomId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_ROOM_ID_LENGTH && /^[a-zA-Z0-9_-]+$/.test(value);
}

export function parseClientMessage(raw: string): ClientMessage | null {
  if (new TextEncoder().encode(raw).byteLength > MAX_MESSAGE_BYTES) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const message = value as Record<string, unknown>;
    if (message.type === "ping" && typeof message.at === "number") return { type: "ping", at: message.at };
    if (message.type === "join" && typeof message.playerId === "string") return { type: "join", playerId: message.playerId };
    if (message.type === "action" && typeof message.action === "string") {
      return { type: "action", action: message.action, ...(Object.hasOwn(message, "payload") ? { payload: message.payload } : {}) };
    }
    return null;
  } catch {
    return null;
  }
}
