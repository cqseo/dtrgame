import { LEGACY_CONFIG } from "../generated/legacy-config";
import { LEGACY_TEMPLATE_LANGUAGE } from "../generated/legacy-template-language";
import { createOriginalFunctions } from "../legacy/original-functions";
import type { LegacyPlayerRecord } from "../legacy/player";
import { createTemplateContext, renderTemplate } from "../legacy/template/render";
import { PhpArray, type PhpValue } from "../legacy/template/values";
import type { StoredLegacyMatch } from "./game-durable-object";
import type { LegacyUserMatch } from "./supabase";

function phpValue(value: unknown): PhpValue {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  const array = new PhpArray();
  if (Array.isArray(value)) value.forEach(entry => array.push(phpValue(entry)));
  else Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => array.set(key, phpValue(entry)));
  return array;
}

const escape = (value: unknown): string => String(value ?? "")
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#039;");

const number = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): number => Number(player[key] ?? 0);
const text = (player: LegacyPlayerRecord, key: keyof LegacyPlayerRecord): string => String(player[key] ?? "");

function formButton(id: string, label: string, command: string, mode = "command"): string {
  return `<input type="button" id="${id}" class="cmdbutton" value="${escape(label)}" onclick="$('mode').value='${mode}';$('command').value='${escape(command)}';postCmd('gamecmd','command.php',this);this.disabled=true;">`;
}

export function renderLegacyCommandPanel(snapshot: StoredLegacyMatch, username: string): string {
  const player = snapshot.state.players[username];
  if (!player) return "玩家数据记录不存在。";
  if (number(player, "hp") <= 0) return '<span class="red b">你已经死亡。</span><br>';
  const action = text(player, "action");
  if (/^enemy\d+$/.test(action)) {
    const pid = Number(action.slice(5));
    const enemy = Object.values(snapshot.state.players).find(candidate => number(candidate, "pid") === pid);
    if (enemy) {
      return `<span class="red b">你遭遇了 ${escape(enemy.name)}！</span><br><input type="hidden" name="target" value="${escape(enemy.name)}">${formButton("z", "攻击", "attack")} ${formButton("x", "返回", "menu")}`;
    }
  }
  if (number(player, "state") >= 1 && number(player, "state") <= 3) {
    return `正在恢复中。<br>${formButton("z", "继续恢复", "rest", "rest")} ${formButton("x", "返回", "back", "rest")}`;
  }
  if (number(player, "itms0")) {
    return `发现了 <span class="yellow b">${escape(player.itm0)}</span>。<br>${formButton("z", "拾取", "itemget", "itemmain")} ${formButton("x", "丢弃", "dropitm0", "itemmain")}`;
  }
  const areas = snapshot.state.availableAreas
    .filter(area => !snapshot.state.forbiddenAreas.includes(area))
    .map(area => `<option value="${area}"${area === number(player, "pls") ? " selected" : ""}>${escape(snapshot.state.areaNames[area] ?? area)}</option>`)
    .join("");
  const items = [1, 2, 3, 4, 5, 6].flatMap(slot => {
    const name = text(player, `itm${slot}` as keyof LegacyPlayerRecord);
    const durability = player[`itms${slot}` as keyof LegacyPlayerRecord];
    return name && Number(durability) !== 0
      ? [`${formButton(`${"asdqwe"[slot - 1]}${"asdqwe"[slot - 1]}`, `使用 ${name}`, `itm${slot}`)}<span class="yellow b">${escape(name)}</span>/${escape(durability)}<br>`]
      : [];
  }).join("");
  return `现在想要做什么？<br><br>
    <select id="moveto" name="moveto">${areas}</select>
    ${formButton("z", "移动", "move")} ${formButton("x", "探索", "search")}<br><br>
    ${items}
    ${formButton("c", "睡眠", "rest1")} ${formButton("v", "治疗", "rest2")}`;
}

function inventory(player: LegacyPlayerRecord): string {
  const equipment = ["wep", "arb", "arh", "ara", "arf", "art"].map(slot =>
    `<tr><td class="b2">${escape(slot.toUpperCase())}</td><td class="b3">${escape(player[slot as keyof LegacyPlayerRecord])}</td><td class="b3">${escape(player[`${slot}e` as keyof LegacyPlayerRecord])}/${escape(player[`${slot}s` as keyof LegacyPlayerRecord])}</td></tr>`
  ).join("");
  const pack = [1, 2, 3, 4, 5, 6].map(slot =>
    `<tr><td class="b2">${slot}</td><td class="b3">${escape(player[`itm${slot}` as keyof LegacyPlayerRecord])}</td><td class="b3">${escape(player[`itme${slot}` as keyof LegacyPlayerRecord])}/${escape(player[`itms${slot}` as keyof LegacyPlayerRecord])}</td></tr>`
  ).join("");
  return `<table cellspacing="0" cellpadding="3"><tr><td valign="top"><table>${equipment}</table></td><td valign="top"><table>${pack}</table></td></tr></table>`;
}

function renderFrameTemplate(name: "header" | "footer", sources: ReadonlyMap<string, string>, variables: Map<string, PhpValue>): string {
  return renderTemplate(name, {
    ...createTemplateContext({ loadTemplate: template => sources.get(template) }),
    variables,
    globals: variables,
    constants: new Map<string, PhpValue>([
      ["IN_GAME", true], ["CURSCRIPT", "game"], ["GAMENAME", "bra"], ["STYLEID", "1"],
      ["TEMPLATEID", "1"], ["TPLDIR", "templates/default"]
    ]),
    functions: createOriginalFunctions(),
    compileOptions: { language: LEGACY_TEMPLATE_LANGUAGE }
  });
}

export function renderLegacyGamePage(
  snapshot: StoredLegacyMatch,
  username: string,
  match: LegacyUserMatch,
  sources: ReadonlyMap<string, string>
): string {
  const player = snapshot.state.players[username];
  if (!player) throw new Error("玩家数据记录不存在。");
  const variables = new Map<string, PhpValue>();
  Object.entries(LEGACY_CONFIG).forEach(([key, value]) => variables.set(key, phpValue(value)));
  variables.set("page", "command_game");
  variables.set("cuser", username);
  variables.set("gametype", match.gametype);
  variables.set("gamestate", snapshot.state.gamestate);
  variables.set("groomtype", match.groomtype);
  const header = renderFrameTemplate("header", sources, variables);
  const footer = renderFrameTemplate("footer", sources, variables);
  const icon = text(player, "icon");
  const iconFile = /\.[a-z0-9]+$/i.test(icon) ? icon : `${text(player, "gd")}_${icon || "0"}.gif`;
  const alive = Object.values(snapshot.state.players).filter(candidate => number(candidate, "hp") > 0).length;
  const area = snapshot.state.areaNames[number(player, "pls")] ?? "";
  const panel = renderLegacyCommandPanel(snapshot, username);
  return `${header}
<details style="margin:8px auto;max-width:760px;padding:7px 12px;border:1px solid #37556d;border-radius:7px;background:rgba(23,35,54,.92);color:#cfe5f7;font-size:12px;line-height:1.7;text-align:left;">
<summary style="cursor:pointer;color:#e3f2ff;font-weight:bold;">操作提示：探索、恢复、商店及离线风险</summary>
<div style="padding-top:6px;">移动时可能发现物品或遭遇角色；离线不代表退出战场，角色仍可能受到攻击。</div></details>
<div id="notice"></div><table id="game_interface" border="0" cellspacing="10" cellpadding="0" align="center"><tr valign="top"><td>
<div id="main" style="width:720px"><table border="0" width="720" cellspacing="0" cellpadding="4">
<tr><td class="b1" colspan="4"><span id="name">${escape(player.name)}</span>　${escape(player.gd)}${escape(player.sNo)}号　当前位置：<span id="pls">${escape(area)}</span></td></tr>
<tr><td class="b3" width="160"><img src="img/${escape(iconFile)}" border="0" style="max-width:140px;max-height:120px"></td>
<td class="b3">等级 Lv.${escape(player.lvl)}<br>经验 ${escape(player.exp)}<br>金钱 ${escape(player.money)} 元<br>队伍 ${escape(player.teamID || "无")}</td>
<td class="b3">生命 <span id="hp">${escape(player.hp)} / ${escape(player.mhp)}</span><br>体力 <span id="sp">${escape(player.sp)} / ${escape(player.msp)}</span><br>攻击 ${escape(player.att)}<br>防御 ${escape(player.def)}</td>
<td class="b3">剩余：<span id="anum">${alive}</span>人<br>击杀 ${number(player, "killnum") + number(player, "npckillnum")}<br>怒气 ${escape(player.rage)}</td></tr>
<tr><td colspan="4" class="b3">${inventory(player)}</td></tr></table></div>
<div style="margin-top:10px"><table id="chat" width="720"><tr><td class="b1">聊天讯息</td></tr><tr><td class="b3"><div id="chatlist" class="chatlist gscroll"></div></td></tr></table></div>
</td><td valign="top"><div id="cmd_interface"><table border="0" width="310" height="560" cellspacing="0" cellpadding="0"><tr><td height="20" class="b1"><span id="cmd-area">${escape(area)}</span></td></tr><tr><td valign="top" class="b3"><div id="log" style="min-height:100px"></div><form method="post" id="gamecmd" name="gamecmd"><input type="hidden" id="mode" name="mode" value="command"><input type="hidden" id="command" name="command" value="menu"><input type="hidden" id="game_roomid" name="game_roomid" value="${match.roomId}"><div id="cmd">${panel}</div></form></td></tr></table></div></td></tr></table>
${footer}`;
}

export function legacyGameUiPayload(snapshot: StoredLegacyMatch, username: string, output: Record<string, unknown>): object {
  const player = snapshot.state.players[username];
  if (!player) return { url: "index.php" };
  const log = String(output.log ?? (output.result as { logHtml?: string } | undefined)?.logHtml ?? "");
  const alive = Object.values(snapshot.state.players).filter(candidate => number(candidate, "hp") > 0).length;
  return {
    innerHTML: {
      log,
      cmd: renderLegacyCommandPanel(snapshot, username),
      hp: `${player.hp} / ${player.mhp}`,
      sp: `${player.sp} / ${player.msp}`,
      pls: snapshot.state.areaNames[number(player, "pls")] ?? "",
      anum: alive
    },
    value: { mode: "command", command: "menu" },
    timer: Number(output.remainingCooldown ?? 0)
  };
}
