import { LEGACY_ROOM_CONFIGURATION } from "../generated/legacy-room-types";
import { LegacyExecutionSession } from "./hooks";

type JsonScalar = string | number | boolean | null;
type JsonValue = JsonScalar | JsonValue[] | { [key: string]: JsonValue };

export interface LegacyRoomOptionValue {
  readonly value: JsonScalar;
  readonly name: string;
  readonly default?: boolean;
}

export interface LegacyRoomOption {
  readonly title: string;
  readonly type: string;
  readonly min?: string | number;
  readonly max?: string | number;
  readonly options?: readonly LegacyRoomOptionValue[];
  readonly "no-notice-when-modified"?: number;
}

export interface LegacyRoomType {
  readonly name: string;
  readonly gtype: number;
  readonly available: boolean;
  readonly soleroom: boolean;
  readonly "without-ready": boolean;
  readonly "without-valid": boolean;
  readonly "cannot-forbid"?: boolean;
  readonly "min-team"?: number;
  readonly pnum: number;
  readonly "ready-expire-time"?: number;
  readonly "leader-position": readonly number[];
  readonly "game-option"?: Readonly<Record<string, LegacyRoomOption>>;
}

export interface LegacyRoomSlot {
  name: string;
  ready: 0 | 1;
  forbidden: 0 | 1;
  leader: number;
}

export interface LegacyRoomChat {
  cid: number;
  data: string;
}

export interface LegacyWaitingRoom {
  roomtype: number;
  readystat: 0 | 1 | 2;
  roomfounder: string;
  kicktime: number;
  player: LegacyRoomSlot[];
  timestamp: number;
  chatdata: LegacyRoomChat[];
  current_game_option: Record<string, JsonScalar>;
}

export interface LegacyRoomRecord {
  roomId: number;
  groomstatus: 0 | 10 | 40;
  groomtype: number;
  gametype: number;
  gamestate: number;
  ownerHeartbeat: number;
  room: LegacyWaitingRoom;
}

export interface LegacyRoomRuntimeState { record: LegacyRoomRecord; }

export type LegacyRoomCommandName =
  | "newchat" | "pos_enter" | "pos_disable" | "pos_enable" | "pos_kick"
  | "rmsetmode" | "game-option" | "leave" | "takeover" | "ready" | "start";

export interface LegacyRoomCommand {
  command: LegacyRoomCommandName;
  actor: string;
  para1?: string;
  para2?: string;
  now: number;
}

export interface LegacyRoomCommandResult {
  changed: boolean;
  left: boolean;
  startRequested: boolean;
  record: LegacyRoomRecord;
}

const roomTypes = LEGACY_ROOM_CONFIGURATION.roomTypes as unknown as Readonly<Record<string, LegacyRoomType>>;

export function getLegacyRoomType(roomType: number): LegacyRoomType {
  const value = roomTypes[String(roomType)];
  if (!value) throw new RangeError(`Unknown legacy room type: ${roomType}`);
  return value;
}

export function legacyRoomParticipantLimit(room: LegacyWaitingRoom): number {
  const groups = room.current_game_option["group-num"];
  return groups !== undefined && groups !== null ? Number(groups) * 5 : getLegacyRoomType(room.roomtype).pnum;
}

export function createLegacyWaitingRoom(roomType: number, founder: string): LegacyWaitingRoom {
  const config = getLegacyRoomType(roomType);
  const currentGameOption: Record<string, JsonScalar> = {};
  for (const [key, option] of Object.entries(config["game-option"] ?? {})) {
    currentGameOption[key] = option.options?.find((entry) => entry.default)?.value ?? null;
  }
  const player: LegacyRoomSlot[] = Array.from({ length: config.pnum }, (_, index) => ({
    name: "", ready: 0, forbidden: 0, leader: config["leader-position"][index] ?? index
  }));
  player[0]!.name = founder;
  return {
    roomtype: roomType,
    readystat: 0,
    roomfounder: founder,
    kicktime: 0,
    player,
    timestamp: 1,
    chatdata: Array.from({ length: 10 }, () => ({ cid: -1, data: "" })),
    current_game_option: currentGameOption
  };
}

export function createLegacyRoomRecord(roomId: number, roomType: number, founder: string, now: number): LegacyRoomRecord {
  const config = getLegacyRoomType(roomType);
  return {
    roomId,
    groomstatus: 10,
    groomtype: roomType,
    gametype: config.gtype,
    gamestate: 0,
    ownerHeartbeat: now,
    room: createLegacyWaitingRoom(roomType, founder)
  };
}

function chat(room: LegacyWaitingRoom, html: string): void {
  if (html) {
    for (let index = 1; index <= 9; index++) room.chatdata[index - 1] = room.chatdata[index]!;
    room.chatdata[9] = { cid: Math.max(room.chatdata[8]?.cid ?? -1, 0) + 1, data: html };
  }
  room.timestamp += 1;
}

function positionOf(room: LegacyWaitingRoom, user: string): number {
  const limit = legacyRoomParticipantLimit(room);
  return room.player.findIndex((slot, index) => index < limit && !slot.forbidden && slot.name === user);
}

function leaderAt(room: LegacyWaitingRoom, position: number): number {
  return getLegacyRoomType(room.roomtype)["leader-position"][position] ?? position;
}

function refreshTeamPositions(room: LegacyWaitingRoom, leader: number): void {
  const limit = legacyRoomParticipantLimit(room);
  for (let index = 0; index < limit; index++) {
    const slot = room.player[index]!;
    if (leaderAt(room, index) === leader && slot.forbidden) {
      slot.forbidden = 0;
      slot.name = "";
      slot.ready = 0;
    }
  }
}

/** Exact readiness state transition from update_roomstate(). */
export function updateLegacyRoomState(room: LegacyWaitingRoom, running: boolean, now: number): boolean {
  const config = getLegacyRoomType(room.roomtype);
  const limit = legacyRoomParticipantLimit(room);
  const teams = new Set<number>();
  let full = true;
  for (let index = 0; index < limit; index++) {
    const slot = room.player[index]!;
    if (slot.forbidden) continue;
    if (slot.name === "") full = false;
    else teams.add(leaderAt(room, index));
  }
  if (teams.size < (config["min-team"] ?? 0)) full = false;
  let changed = false;
  if (!running && full && room.readystat === 0) {
    room.readystat = 1;
    room.kicktime = now + (config["ready-expire-time"] ?? 30);
    room.timestamp += 1;
    for (const slot of room.player) slot.ready = 0;
    changed = true;
  }
  if (!full) {
    if (room.readystat !== 0) changed = true;
    room.readystat = 0;
  }
  return changed;
}

function autoKick(room: LegacyWaitingRoom, now: number): boolean {
  if (room.readystat !== 1 || now < room.kicktime) return false;
  const limit = legacyRoomParticipantLimit(room);
  for (let index = 0; index < limit; index++) {
    const slot = room.player[index]!;
    if (!slot.forbidden && !slot.ready && slot.name !== "") {
      chat(room, `<span class="grey b">${slot.name}因为长时间未准备，被系统踢出了位置。</span><br>`);
      slot.name = "";
    }
  }
  return true;
}

function phpInt(value: string | undefined): number {
  const match = value?.trim().match(/^[+-]?\d+/);
  return match ? Number.parseInt(match[0], 10) : 0;
}

function optionIsValid(config: LegacyRoomOption, value: string): boolean {
  if (config.type === "number") {
    const numeric = phpInt(value);
    if (config.min !== undefined && numeric < Number(config.min)) return false;
    if (config.max !== undefined && numeric > Number(config.max)) return false;
    return true;
  }
  return config.options?.some((option) => String(option.value) === value) ?? false;
}

function optionName(config: LegacyRoomOption, value: JsonScalar): string {
  if (config.type === "number") return String(value ?? 0);
  return config.options?.find((option) => String(option.value) === String(value))?.name ?? "";
}

function changeRoomMode(record: LegacyRoomRecord, actor: string, requestedType: number): boolean {
  const room = record.room;
  const requested = roomTypes[String(requestedType)];
  if (positionOf(room, actor) !== 0 || !requested || requestedType === room.roomtype || requested.soleroom) {
    chat(room, `<span class="red b">${actor}试图修改房间模式但未成功</span><br>`);
    return true;
  }
  const next = createLegacyWaitingRoom(requestedType, "");
  next.chatdata = room.chatdata;
  const count = Math.min(room.player.length, next.player.length);
  for (let index = 0; index < count; index++) {
    const oldSlot = room.player[index]!;
    const nextSlot = next.player[index]!;
    if ([1, 2, 3, 4].includes(requestedType) && oldSlot.forbidden && !oldSlot.name) nextSlot.forbidden = 1;
    else if (oldSlot.name) nextSlot.name = oldSlot.name;
  }
  next.timestamp = room.timestamp;
  next.roomfounder = actor;
  record.room = next;
  record.groomtype = requestedType;
  record.gametype = requested.gtype;
  chat(next, `<span class="grey b">${actor}将房间模式修改为了${requested.name}</span><br>`);
  return true;
}

function applyPositionCommand(room: LegacyWaitingRoom, actor: string, command: LegacyRoomCommandName, rawPosition: string): boolean {
  const all = rawPosition === "all";
  const position = all ? -1 : phpInt(rawPosition);
  const userPosition = positionOf(room, actor);
  const limit = legacyRoomParticipantLimit(room);
  if (!all && position === userPosition) chat(room, `<span class="red b">${actor}试图操作他自己的位置</span><br>`);
  else if (!all && (position < 0 || position >= limit)) chat(room, `<span class="red b">${actor}试图操作一个不存在的位置</span><br>`);
  else if (command === "pos_enter") {
    const slot = room.player[position]!;
    if (slot.forbidden) chat(room, `<span class="red b">${actor}试图进入一个被禁用的位置</span><br>`);
    else if (slot.name) chat(room, `<span class="red b">${actor}试图进入一个有人的位置</span><br>`);
    else {
      if (userPosition >= 0) {
        const oldSlot = room.player[userPosition]!;
        oldSlot.name = "";
        oldSlot.ready = 0;
        if (userPosition === 0 && position !== 0) room.roomfounder = "";
        if (userPosition === leaderAt(room, userPosition)) refreshTeamPositions(room, userPosition);
      }
      slot.name = actor;
      slot.ready = 0;
      if (position === 0) room.roomfounder = actor;
      chat(room, userPosition < 0
        ? `<span class="grey b">${actor}进入了一个空位置</span><br>`
        : `<span class="grey b">${actor}移动了位置</span><br>`);
    }
  } else if (userPosition < 0) chat(room, `<span class="red b">不在房间内的${actor}试图操作一个位置</span><br>`);
  else if (command === "pos_disable" || command === "pos_enable") {
    const checkPosition = all ? userPosition : position;
    if (all === false && !/^[+-]?\d/.test(rawPosition)) chat(room, `<span class="red b">${actor}试图操作一个错误的位置</span><br>`);
    else if (userPosition !== 0 && userPosition !== leaderAt(room, checkPosition)) chat(room, `<span class="red b">并非队长的${actor}试图操作一个位置</span><br>`);
    else if (!all && room.player[position]!.name) chat(room, `<span class="red b">${actor}试图操作一个有人的位置</span><br>`);
    else {
      room.player[userPosition]!.ready = 0;
      if (command === "pos_disable") {
        const config = getLegacyRoomType(room.roomtype);
        if (config["cannot-forbid"] || limit <= 2) chat(room, `<span class="red b">${actor}试图禁用一个位置，但本房间不允许禁用</span><br>`);
        else if (all) {
          for (let index = 0; index < limit; index++) {
            const slot = room.player[index]!;
            if (!slot.name && (userPosition === 0 || leaderAt(room, index) === userPosition)) slot.forbidden = 1;
          }
          chat(room, userPosition === 0
            ? `<span class="grey b">${actor}禁用了全部空位置</span><br>`
            : `<span class="grey b">${actor}禁用了其队伍中的全部空位置</span><br>`);
        } else {
          const slot = room.player[position]!;
          slot.name = "";
          slot.forbidden = 1;
          chat(room, userPosition === 0
            ? `<span class="grey b">${actor}禁用了房间的一个位置</span><br>`
            : `<span class="grey b">${actor}禁用了其队伍的一个位置</span><br>`);
        }
      } else if (!all) {
        const slot = room.player[position]!;
        slot.name = "";
        slot.forbidden = 0;
        chat(room, userPosition === 0
          ? `<span class="grey b">${actor}重新启用了房间的一个位置</span><br>`
          : `<span class="grey b">${actor}重新启用了其队伍的一个位置</span><br>`);
      }
    }
  } else if (command === "pos_kick" && !all) {
    const slot = room.player[position]!;
    if (!slot.name) chat(room, `<span class="red b">${actor}试图踢掉一个不存在的玩家</span><br>`);
    else if (userPosition !== 0 && userPosition !== leaderAt(room, position)) chat(room, `<span class="red b">并非房主或队长的${actor}试图踢人</span><br>`);
    else if (userPosition === position) chat(room, `<span class="red b">${actor}试图踢自己</span><br>`);
    else {
      if (position === leaderAt(room, position)) refreshTeamPositions(room, position);
      const kicked = slot.name;
      slot.name = "";
      slot.ready = 0;
      chat(room, `<span class="grey b">${actor}将${kicked}踢出了房间</span><br>`);
    }
  }
  return true;
}

export function applyLegacyRoomCommand(state: LegacyRoomRuntimeState, input: LegacyRoomCommand): LegacyRoomCommandResult {
  const session = new LegacyExecutionSession(state, { now: () => input.now * 1000 });
  return session.transaction(() => {
    const record = state.record;
    const room = record.room;
    if (!(record.groomstatus >= 10 && record.groomstatus < 40) && input.command !== "leave") throw new Error("房间不在等待状态，命令无效。");
    if (room.readystat === 2 && input.command !== "leave") throw new Error("房间已开始，命令无效。");
    if (room.player[0]?.name === input.actor && record.groomstatus < 40) record.ownerHeartbeat = input.now;
    updateLegacyRoomState(room, record.groomstatus >= 40, input.now);
    if (getLegacyRoomType(room.roomtype).soleroom) {
      if (input.command !== "leave") return { changed: false, left: false, startRequested: false, record };
      return { changed: false, left: true, startRequested: false, record };
    }
    autoKick(room, input.now);
    let changed = false;
    let left = false;
    let startRequested = false;
    if (input.command === "newchat") {
      chat(room, `<span class="white b"><span class="yellow b">${input.actor}:</span>&nbsp;${input.para1 ?? ""}</span><br>`);
      changed = true;
    } else if (input.command.startsWith("pos_")) {
      changed = applyPositionCommand(room, input.actor, input.command, input.para1 ?? "");
    } else if (input.command === "rmsetmode") {
      changed = changeRoomMode(record, input.actor, phpInt(input.para1));
    } else if (input.command === "game-option") {
      const actorPosition = positionOf(room, input.actor);
      const key = input.para1 ?? "";
      const value = input.para2 ?? "";
      const config = getLegacyRoomType(room.roomtype)["game-option"]?.[key];
      if (actorPosition !== 0) chat(room, `<span class="red b">并非房主的${input.actor}试图改变游戏设置</span><br>`);
      else if (!config || !optionIsValid(config, value)) chat(room, `<span class="red b">${input.actor}试图设置一个错误的游戏参数</span><br>`);
      else {
        const previous = room.current_game_option[key] ?? null;
        room.current_game_option[key] = config.type === "number" ? phpInt(value) : value;
        if (!config["no-notice-when-modified"]) {
          chat(room, `<span class="grey b">${input.actor}将 ${config.title} 从 ${optionName(config, previous)} 变为 ${optionName(config, room.current_game_option[key]!)} </span><br>`);
        } else room.timestamp += 1;
        if (key === "group-num") {
          const oldCount = Number(previous) * 5;
          const newCount = Number(value) * 5;
          for (let index = Math.min(oldCount, newCount); index < Math.max(oldCount, newCount); index++) {
            const slot = room.player[index]!;
            slot.name = "";
            slot.ready = 0;
            slot.forbidden = 0;
          }
        }
      }
      changed = true;
    } else if (input.command === "leave") {
      const userPosition = positionOf(room, input.actor);
      if (record.groomstatus < 40 && userPosition >= 0) {
        if (userPosition === leaderAt(room, userPosition)) refreshTeamPositions(room, userPosition);
        const slot = room.player[userPosition]!;
        slot.name = "";
        slot.ready = 0;
        if (userPosition === 0) room.roomfounder = "";
      }
      chat(room, `<span class="grey b">${input.actor}离开了房间</span><br>`);
      changed = true;
      left = true;
    } else if (input.command === "takeover") {
      const userPosition = positionOf(room, input.actor);
      const canTakeOver = userPosition > 0 && room.readystat !== 2 && input.now - record.ownerHeartbeat >= 300
        && room.player[0]?.name && room.player[userPosition]?.name === input.actor && !room.player[userPosition]?.forbidden;
      if (canTakeOver) {
        if (userPosition === leaderAt(room, userPosition)) refreshTeamPositions(room, userPosition);
        room.player[0] = { name: input.actor, ready: 0, forbidden: 0, leader: room.player[0]!.leader };
        room.player[userPosition]!.name = "";
        room.player[userPosition]!.ready = 0;
        room.readystat = 0;
        room.kicktime = 0;
        room.roomfounder = input.actor;
        for (const slot of room.player) slot.ready = 0;
        record.ownerHeartbeat = input.now;
        chat(room, `<span class="yellow b">原房主长时间离线，${input.actor}已接管房间房主位置。</span><br>`);
      } else chat(room, `<span class="yellow b">房主仍在线、离线时间不足5分钟或你尚未入座，暂时不能接管。</span><br>`);
      changed = true;
    } else if (input.command === "ready") {
      const userPosition = positionOf(room, input.actor);
      const config = getLegacyRoomType(room.roomtype);
      if (userPosition >= 0 && room.readystat === 1 && !room.player[userPosition]!.ready && !config["without-ready"]) {
        room.player[userPosition]!.ready = 1;
        const limit = legacyRoomParticipantLimit(room);
        const allReady = room.player.slice(0, limit).every((slot) => slot.forbidden || slot.ready);
        chat(room, `<span class="grey b">${input.actor}点击了准备</span><br>`);
        if (allReady) {
          room.readystat = 2;
          chat(room, `<span class="grey b">所有人均已准备，游戏即将开始..</span><br>`);
          startRequested = true;
        }
        changed = true;
      }
    } else if (input.command === "start") {
      const userPosition = positionOf(room, input.actor);
      if (userPosition === 0 && getLegacyRoomType(room.roomtype)["without-ready"]) {
        room.player[0]!.ready = 1;
        room.readystat = 2;
        room.timestamp += 1;
        startRequested = true;
        changed = true;
      }
    }
    updateLegacyRoomState(record.room, record.groomstatus >= 40, input.now);
    return { changed, left, startRequested, record };
  });
}
