/**
 * Port of the room-prefix helpers in include/roommng/room.func.php.
 *
 * The lobby templates call these on every room they list, and their results
 * decide which rooms a player is shown and which link each one gets. They
 * look trivial, but they run on PHP's own rules: `$room_prefix &&` is PHP
 * truthiness, so the string "0" is false; `substr` works on bytes; and the
 * int cast takes a leading numeric prefix rather than failing.
 *
 * Held to the original by test/legacy-room-prefix.parity.test.mjs.
 */
import { toBool, toInt, toStringValue, type PhpValue } from "./template/values";

const utf8 = new TextEncoder();
const utf8Decode = new TextDecoder();

/** PHP's substr, which counts bytes rather than code points. */
function byteSubstr(value: string, start: number, length?: number): string {
  const bytes = utf8.encode(value);
  const from = start < 0 ? Math.max(bytes.length + start, 0) : Math.min(start, bytes.length);
  const to = length === undefined ? bytes.length : Math.min(from + Math.max(length, 0), bytes.length);
  return utf8Decode.decode(bytes.slice(from, to));
}

/** `return $room_prefix ? (string)substr($room_prefix,0,1) : '';` */
export function roomPrefixKind(roomPrefix: PhpValue = ""): string {
  if (!toBool(roomPrefix)) return "";
  return byteSubstr(toStringValue(roomPrefix), 0, 1);
}

/** `return ($room_prefix && 's' == room_prefix_kind($room_prefix));` */
export function roomCheckSubroom(roomPrefix: PhpValue = ""): boolean {
  return toBool(roomPrefix) && roomPrefixKind(roomPrefix) === "s";
}

/** `if (room_check_subroom(..)) return (int)substr($room_prefix,1); else return 0;` */
export function roomPrefix2Id(roomPrefix: PhpValue = ""): number {
  if (!roomCheckSubroom(roomPrefix)) return 0;
  return toInt(byteSubstr(toStringValue(roomPrefix), 1));
}

/** `if(!$id) return ''; else return 's'.$id;` */
export function roomId2Prefix(id: PhpValue): string {
  if (!toBool(id)) return "";
  return `s${toStringValue(id)}`;
}

export interface RoomTypeAvailability {
  readonly available?: PhpValue;
  readonly "available-start"?: PhpValue;
  readonly "available-end"?: PhpValue;
  readonly "req-mod"?: PhpValue;
}

/**
 * Port of check_room_available().
 *
 * `$now` is the original's request timestamp, and `definedModules` stands in
 * for `defined('MOD_'.strtoupper($roomtypedata['req-mod']))`, so a room type
 * gated behind a module the install does not have stays unavailable.
 */
export function checkRoomAvailable(
  roomTypeData: RoomTypeAvailability,
  now: number,
  definedModules: ReadonlySet<string>
): boolean {
  if (!toBool(roomTypeData.available ?? null)) return false;

  const start = roomTypeData["available-start"] ?? null;
  if (toBool(start) && now < toInt(start)) return false;

  const end = roomTypeData["available-end"] ?? null;
  if (toBool(end) && now > toInt(end)) return false;

  const requiredModule = roomTypeData["req-mod"] ?? null;
  if (toBool(requiredModule) && !definedModules.has(toStringValue(requiredModule).toUpperCase())) {
    return false;
  }

  return true;
}
