import { LEGACY_ROOM_CONFIGURATION } from "../generated/legacy-room-types";
import { legacyRoomPosition, type LegacyRoomRecord } from "../legacy/room";
import { createOriginalFunctions } from "../legacy/original-functions";
import { createTemplateContext, renderTemplate } from "../legacy/template/render";
import { PhpArray, toInt, toStringValue, type PhpValue } from "../legacy/template/values";
import { LEGACY_TEMPLATE_LANGUAGE } from "../generated/legacy-template-language";

function phpValue(value: unknown): PhpValue {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  const result = new PhpArray();
  if (Array.isArray(value)) value.forEach(entry => result.push(phpValue(entry)));
  else for (const [key, entry] of Object.entries(value as Record<string, unknown>)) result.set(key, phpValue(entry));
  return result;
}

function instance3DebuffTips(level: number): string {
  const clubs = ["称号固定为解离攻坚", "可任意选择一个称号", "称号固定为走路萌物"];
  const debuffs = [
    "", "等级上限-100", "全息幻象受到伤害-15%", "杏仁豆腐、黑幕、真职人、电波幽灵受到伤害-15%",
    "初始体力上限-200", "初始生命上限-50", "陷阱遭遇率+20%", "商店物品售价+25%", "初始生命上限-50",
    "使用命体回复道具效果-30%", "受到最终伤害+10%", "记忆上限-20", "开局金钱-1000元",
    "开局5分钟内攻击无法获得熟练度", "开局获得一个诅咒道具", "数据碎片造成伤害+25%",
    "受伤或受到异常状态20秒内无法去除", "视野上限-4", "受伤或受到异常状态时-10生命上限",
    "受到最终伤害+10%", "开局进入连斗", "受到最终伤害+15%", "开局获得一个诅咒道具",
    "无法使用干扰设备，使用探测仪器极大概率失败", "无法使用视野和记忆", "剧情BOSS和英灵殿NPC造成的伤害+25%",
    "无法装备身体防具", "物品/角色发现率-20%", "抹消基础失效率变为10%", "控伤基础失效率变为15%",
    "先制率-20%，命中率-20%"
  ];
  let output = `${clubs[Math.floor(Math.max(level - 1, 0) / 10)] ?? ""}<br>`;
  for (let index = 1; index <= level; index++) output += `${debuffs[index] ?? ""}<br>`;
  return output;
}

export function renderLegacyRoomMain(
  record: LegacyRoomRecord,
  username: string,
  sources: ReadonlyMap<string, string>,
  now = Math.floor(Date.now() / 1000)
): string {
  const room = phpValue(record.room) as PhpArray;
  const roomTypes = phpValue(LEGACY_ROOM_CONFIGURATION.roomTypes) as PhpArray;
  const variables = new Map<string, PhpValue>([
    ["roomdata", room], ["room_id", record.roomId],
    ["upos", legacyRoomPosition(record.room, username)], ["roomtypelist", roomTypes]
  ]);
  const roomType = () => roomTypes.get(room.get("roomtype"));
  const functions = createOriginalFunctions({
    room_get_vars: ([data, rawKey]) => {
      if (!(data instanceof PhpArray)) return null;
      const key = toStringValue(rawKey ?? null);
      if (data.has(key)) return data.get(key);
      const config = roomType();
      if (config instanceof PhpArray && config.has(key)) return config.get(key);
      const options = data.get("current_game_option");
      if (options instanceof PhpArray && options.has(key)) return options.get(key);
      if (key === "pnum" && options instanceof PhpArray && options.has("group-num")) {
        return toInt(options.get("group-num")) * 5;
      }
      return null;
    },
    room_creater_check: ([position]) => toInt(position ?? null) === 0,
    room_team_leader_check: ([, position]) => {
      const config = roomType();
      const leaders = config instanceof PhpArray ? config.get("leader-position") : null;
      return leaders instanceof PhpArray ? leaders.get(toInt(position ?? null)) : null;
    },
    get_instance3_debuff_tips: ([level]) => instance3DebuffTips(toInt(level ?? null)),
    time: () => now
  });
  return renderTemplate("roommain", {
    ...createTemplateContext({ loadTemplate: name => sources.get(name) }),
    variables,
    globals: variables,
    constants: new Map<string, PhpValue>([["IN_GAME", true]]),
    functions,
    compileOptions: { language: LEGACY_TEMPLATE_LANGUAGE }
  });
}

export function legacyRoomUiPayload(record: LegacyRoomRecord, username: string, roomHtml: string): object {
  const payload: Record<string, unknown> = {
    innerHTML: { roommain: roomHtml },
    value: { timestamp: record.room.timestamp }
  };
  if (record.room.readystat === 2) (payload.innerHTML as Record<string, string>).roomchatarea = "<div></div>";
  else payload.lastchat = record.room.chatdata;
  return payload;
}
