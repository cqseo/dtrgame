export const MAX_ROOM_ID_LENGTH = 48;
export const MAX_MESSAGE_BYTES = 8 * 1024;
export const MAX_PLAYER_ID_LENGTH = 64;
export const MAX_COMMAND_ID_LENGTH = 96;
export const MAX_ACTION_LENGTH = 48;

export type ClientMessage =
  | { type: "join"; playerId: string }
  | { type: "action"; commandId: string; action: string; payload?: unknown }
  | { type: "ping"; at: number };

export function isValidRoomId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_ROOM_ID_LENGTH && /^[a-zA-Z0-9_-]+$/.test(value);
}

export function isValidPlayerId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_PLAYER_ID_LENGTH && /^[a-zA-Z0-9_-]+$/.test(value);
}

export function isValidCommandId(value: string): boolean {
  return value.length > 0 && value.length <= MAX_COMMAND_ID_LENGTH && /^[a-zA-Z0-9:_-]+$/.test(value);
}

export function parseClientMessage(raw: string): ClientMessage | null {
  if (new TextEncoder().encode(raw).byteLength > MAX_MESSAGE_BYTES) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const message = value as Record<string, unknown>;
    if (message.type === "ping" && typeof message.at === "number" && Number.isFinite(message.at)) {
      return { type: "ping", at: message.at };
    }
    if (message.type === "join" && typeof message.playerId === "string" && isValidPlayerId(message.playerId)) {
      return { type: "join", playerId: message.playerId };
    }
    if (
      message.type === "action" &&
      typeof message.commandId === "string" &&
      isValidCommandId(message.commandId) &&
      typeof message.action === "string" &&
      message.action.length > 0 &&
      message.action.length <= MAX_ACTION_LENGTH
    ) {
      return {
        type: "action",
        commandId: message.commandId,
        action: message.action,
        ...(Object.hasOwn(message, "payload") ? { payload: message.payload } : {})
      };
    }
    return null;
  } catch {
    return null;
  }
}
