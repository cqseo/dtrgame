import { legacyInputRecord, legacyStringFilter } from "../legacy/input";
import type { LegacyRoomCommand, LegacyRoomCommandName } from "../legacy/room";
import { legacyEncode } from "../original-protocol";

const ROOM_COMMANDS = new Set<LegacyRoomCommandName>([
  "newchat", "pos_enter", "pos_disable", "pos_enable", "pos_kick", "rmsetmode",
  "game-option", "leave", "takeover", "ready", "start"
]);

export async function parseLegacyForm(request: Request): Promise<Record<string, string>> {
  const type = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (type === "application/x-www-form-urlencoded" || !type) {
    return legacyInputRecord(new URLSearchParams(await request.text()));
  }
  if (type === "multipart/form-data") {
    const form = await request.formData();
    const params = new URLSearchParams();
    for (const [key, value] of form) if (typeof value === "string") params.append(key, value);
    return legacyInputRecord(params);
  }
  throw new TypeError("Unsupported legacy command content type.");
}

export function toLegacyRoomCommand(
  input: Readonly<Record<string, string>>,
  actor: string,
  now: number
): LegacyRoomCommand {
  const command = input.command as LegacyRoomCommandName | undefined;
  if (!command || !ROOM_COMMANDS.has(command)) throw new RangeError("Unknown legacy room command.");
  const result: LegacyRoomCommand = { command, actor: legacyStringFilter(actor), now };
  if (input.para1 !== undefined) result.para1 = input.para1;
  if (input.para2 !== undefined) result.para2 = input.para2;
  return result;
}

export async function legacyCommandResponse(payload: unknown, status = 200): Promise<Response> {
  return new Response(await legacyEncode(payload), {
    status,
    headers: {
      "content-type": "text/plain;charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff"
    }
  });
}
