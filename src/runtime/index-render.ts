import { LEGACY_CONFIG } from "../generated/legacy-config";
import { ENABLED_LEGACY_MODULES } from "../generated/legacy-registry";
import { LEGACY_ROOM_CONFIGURATION } from "../generated/legacy-room-types";
import { LEGACY_TEMPLATE_LANGUAGE } from "../generated/legacy-template-language";
import {
  legacyRoomParticipantLimit,
  type LegacyRoomRecord,
  type LegacyWaitingRoom
} from "../legacy/room";
import { createOriginalFunctions } from "../legacy/original-functions";
import { createTemplateContext, renderTemplate } from "../legacy/template/render";
import { PhpArray, toBool, toInt, toStringValue, type PhpValue } from "../legacy/template/values";
import type { LegacyAccountRow } from "../original-login";
import { legacyDecode } from "../original-protocol";
import type { SupabaseIndexGameRow, SupabaseLegacyIndexState } from "./supabase";

const TEMPLATE_DIR = "templates/default";

function phpValue(value: unknown): PhpValue {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  const result = new PhpArray();
  if (Array.isArray(value)) value.forEach(entry => result.push(phpValue(entry)));
  else for (const [key, entry] of Object.entries(value as Record<string, unknown>)) result.set(key, phpValue(entry));
  return result;
}

function roomValue(room: PhpArray, roomTypes: PhpArray, rawKey: PhpValue): PhpValue {
  const key = toStringValue(rawKey);
  if (room.has(key)) return room.get(key);
  const config = roomTypes.get(room.get("roomtype"));
  if (config instanceof PhpArray && config.has(key)) return config.get(key);
  const options = room.get("current_game_option");
  if (options instanceof PhpArray && options.has(key)) return options.get(key);
  if (key === "pnum" && options instanceof PhpArray && options.has("group-num")) {
    return toInt(options.get("group-num")) * 5;
  }
  return null;
}

function bubbleboxVariables(styleText: string): Map<string, PhpValue> {
  const style: Record<string, string | number> = {
    id: "", height: 100, width: 100, "z-index-base": 10,
    "offset-x": 0, "offset-y": 0, opacity: 0.95, cancellable: 0,
    "change-to": "", "scroll-bar": 0, "border-width-x": 5, "border-width-y": 5,
    "margin-top": 8, "margin-bottom": 8, "margin-left": 8, "margin-right": 4
  };
  for (const item of `${styleText};`.split(";")) {
    const separator = item.indexOf(":");
    if (separator < 0) continue;
    const key = item.slice(0, separator).trim();
    if (!(key in style)) continue;
    style[key] = item.slice(separator + 1).trim();
  }
  const number = (key: string): number => Number(style[key]) || 0;
  const height = number("height"), width = number("width");
  const borderX = number("border-width-x"), borderY = number("border-width-y");
  const marginTop = number("margin-top"), marginBottom = number("margin-bottom");
  const marginLeft = number("margin-left"), marginRight = number("margin-right");
  const offsetX = number("offset-x"), offsetY = number("offset-y");
  const variables = new Map<string, PhpValue>();
  for (const [key, value] of Object.entries(style)) {
    variables.set(`bbox_${key.replaceAll("-", "_")}`, phpValue(value));
  }
  const calculated: Record<string, number> = {
    bbox_positioner_inner_margin_top: offsetY - Math.ceil((height + borderY * 2 + marginTop + marginBottom) / 2),
    bbox_positioner_inner_margin_left: offsetX - Math.ceil((width + borderX * 2 + marginLeft + marginRight) / 2),
    bbox_positioner_inner_min_width: width + borderX * 2 + marginLeft + marginRight,
    bbox_positioner_inner_max_width: width + borderX * 2 + marginLeft + marginRight,
    bbox_positioner_inner_min_height: height + borderY * 2 + marginTop + marginBottom,
    bbox_positioner_inner_max_height: height + borderY * 2 + marginTop + marginBottom,
    bbox_screen_fader_inner_margin_top: offsetY - Math.ceil((height + marginTop + marginBottom) / 2),
    bbox_screen_fader_inner_margin_left: offsetX - Math.ceil((width + marginLeft + marginRight) / 2),
    bbox_screen_fader_inner_min_width: width + marginLeft + marginRight,
    bbox_screen_fader_inner_max_width: width + marginLeft + marginRight,
    bbox_screen_fader_inner_min_height: height + marginTop + marginBottom,
    bbox_screen_fader_inner_max_height: height + marginTop + marginBottom,
    bubblebox_container_min_height: height + marginTop + marginBottom,
    bubblebox_container_max_height: height + marginTop + marginBottom
  };
  for (const [key, value] of Object.entries(calculated)) variables.set(key, value);
  return variables;
}

function pageConstants(): Map<string, PhpValue> {
  const constants = new Map<string, PhpValue>([
    ["IN_GAME", true], ["GAMENAME", "bra"], ["CURSCRIPT", "index"],
    ["STYLEID", "1"], ["TEMPLATEID", "1"], ["TPLDIR", TEMPLATE_DIR]
  ]);
  for (const module of ENABLED_LEGACY_MODULES) constants.set(`MOD_${module.name.toUpperCase()}`, true);
  return constants;
}

function gameVariables(row: SupabaseIndexGameRow): Array<[string, PhpValue]> {
  return Object.entries(row).map(([key, value]) => [key, phpValue(value)]);
}

interface IndexRoomView {
  record: LegacyRoomRecord;
  row: SupabaseIndexGameRow;
  value: Record<string, unknown>;
}

async function roomViews(rows: readonly SupabaseIndexGameRow[], now: number): Promise<IndexRoomView[]> {
  const views: IndexRoomView[] = [];
  for (const row of rows) {
    if (!row.roomvars) continue;
    let room: LegacyWaitingRoom;
    try { room = await legacyDecode<LegacyWaitingRoom>(row.roomvars); }
    catch { continue; }
    const record: LegacyRoomRecord = {
      roomId: row.groomid,
      groomstatus: row.groomstatus as 0 | 10 | 40,
      groomtype: row.groomtype,
      gametype: row.gametype,
      gamestate: row.gamestate,
      ownerHeartbeat: now,
      room
    };
    const limit = legacyRoomParticipantLimit(room);
    const names = room.player.slice(0, limit).filter(slot => !slot.forbidden && slot.name).map(slot => slot.name);
    const config = LEGACY_ROOM_CONFIGURATION.roomTypes[String(room.roomtype) as keyof typeof LEGACY_ROOM_CONFIGURATION.roomTypes];
    views.push({ record, row, value: {
      id: row.groomid,
      gamestate: row.gamestate,
      status: row.groomstatus,
      nowplayer: names.length,
      maxplayer: limit,
      roomtype: room.roomtype,
      roomdata: room,
      soleroom: Boolean(config?.soleroom),
      "without-ready": Boolean(config?.["without-ready"]),
      runningtime: row.starttime > 0 ? Math.max(0, now - row.starttime) : 0,
      validlist: names
    }});
  }
  return views.sort((left, right) => {
    const weight = (view: IndexRoomView): number => {
      const value = view.value;
      if (value.soleroom) return Number(value.id);
      if (Number(value.status) >= 40) return 20000 + Number(value.id);
      return Math.max(0, 10000 - (Number(value.maxplayer) - Number(value.nowplayer)) * 100 + Number(value.id));
    };
    return weight(left) - weight(right);
  });
}

const INDEX_TRAILER = `\r\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\r\n<html>\r\n <head>\r\n<script type="text/javascript">\r\nvar gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");\r\ndocument.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));\r\n</script>\r\n<script type="text/javascript">\r\ntry {\r\nvar pageTracker = _gat._getTracker("UA-9744745-2");\r\npageTracker._trackPageview();\r\n} catch(err) {}</script>\r\n </head>\r\n</html>`;

export async function renderLegacyIndex(
  account: LegacyAccountRow | null,
  cookiePassword: string,
  state: SupabaseLegacyIndexState,
  sources: ReadonlyMap<string, string>,
  now = Math.floor(Date.now() / 1000)
): Promise<string> {
  const views = await roomViews(state.rooms, now);
  const current = account?.roomid ? views.find(view => view.record.roomId === account.roomid) : undefined;
  const game = current?.row ?? state.globalState;
  const roomTypes = phpValue(LEGACY_ROOM_CONFIGURATION.roomTypes) as PhpArray;
  const variables = new Map<string, PhpValue>();
  for (const [key, value] of Object.entries(LEGACY_CONFIG)) variables.set(key, phpValue(value));
  for (const [key, value] of gameVariables(game)) variables.set(key, value);

  const date = new Date(now * 1000);
  const pad = (value: number): string => String(value).padStart(2, "0");
  variables.set("now", now);
  variables.set("sec", pad(date.getUTCSeconds()));
  variables.set("min", pad(date.getUTCMinutes()));
  variables.set("hour", pad(date.getUTCHours()));
  variables.set("day", String(date.getUTCDate()));
  variables.set("month", String(date.getUTCMonth() + 1));
  variables.set("year", String(date.getUTCFullYear()));
  variables.set("wday", String(date.getUTCDay()));
  variables.set("cuser", account?.username ?? "");
  variables.set("cpass", account ? cookiePassword : "");
  variables.set("room_id", account?.roomid ?? 0);
  variables.set("room_prefix", current ? `s${current.record.roomId}` : "");
  variables.set("roomdata", current ? phpValue(current.record.room) : new PhpArray());
  variables.set("roomtypelist", roomTypes);
  variables.set("max_private_room_num", LEGACY_ROOM_CONFIGURATION.maxPrivateRoomNum);
  variables.set("roomlist", phpValue(Object.fromEntries(views.map(view => [view.record.roomId, view.value]))));
  variables.set("shroomlist", phpValue(views.map(view => view.value)));
  variables.set("adminmsg", state.siteText.adminmsg ?? "");
  let systemMessage = state.siteText.systemmsg ?? "";
  if (toBool(variables.get("disable_newgame") ?? null)) {
    systemMessage = '<div class="evergreen2" style="color:red">即将维护 新游戏暂停开放</div>' + systemMessage;
  } else if (toBool(variables.get("disable_newroom") ?? null)) {
    systemMessage = '<div class="evergreen2" style="color:red">即将维护 房间暂停开放</div>' + systemMessage;
  }
  variables.set("systemmsg", systemMessage);
  const start = Number(game.starttime ?? 0);
  variables.set("timing", game.gamestate > 10 ? (now - start) * 1000 : start > now ? (start - now) * 1000 : 0);
  variables.set("areaintv", 30);
  variables.set("areaadd", 4);
  variables.set("arealimit", 2);
  variables.set("areaesc", 0);

  const constants = pageConstants();
  const functions = createOriginalFunctions({
    room_check_subroom: ([prefix]) => /^s\d+$/.test(toStringValue(prefix ?? null)),
    room_prefix2id: ([prefix]) => /^s\d+$/.test(toStringValue(prefix ?? null)) ? Number(toStringValue(prefix ?? null).slice(1)) : 0,
    room_get_vars: ([data, key]) => data instanceof PhpArray ? roomValue(data, roomTypes, key ?? null) : null,
    check_room_available: ([raw]) => {
      if (!(raw instanceof PhpArray) || !toBool(raw.get("available"))) return false;
      const startAt = toInt(raw.get("available-start"));
      const endAt = toInt(raw.get("available-end"));
      if (startAt && now < startAt) return false;
      if (endAt && now > endAt) return false;
      const required = toStringValue(raw.get("req-mod"));
      return !required || constants.has(`MOD_${required.toUpperCase()}`);
    }
  });
  const renderBubblebox = (name: string, localVariables = new Map<string, PhpValue>()): string => renderTemplate(name, {
    ...createTemplateContext({ loadTemplate: template => sources.get(template) }),
    variables: localVariables,
    globals: variables,
    constants,
    functions,
    compileOptions: { language: LEGACY_TEMPLATE_LANGUAGE }
  });
  const writeFunctions = new Map<string, (args: PhpValue[]) => string>([
    ["bubblebox_start", args => renderBubblebox("bubblebox_start", bubbleboxVariables(toStringValue(args[0] ?? null)))],
    ["bubblebox_end", () => renderBubblebox("bubblebox_end")]
  ]);

  return renderTemplate("index", {
    ...createTemplateContext({ loadTemplate: name => sources.get(name) }),
    variables,
    globals: variables,
    constants,
    functions,
    writeFunctions,
    compileOptions: { language: LEGACY_TEMPLATE_LANGUAGE }
  }) + INDEX_TRAILER;
}
