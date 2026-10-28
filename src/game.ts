import { LEGACY_AREAS, LEGACY_MAP_RULES, PROTOTYPE_AREA_ALIASES, isLegacyAreaId, normalizeSavedArea, type LegacyAreaId } from "./legacy-map";

import { WEATHER, TEAM_RULES, detectWeaponFamily, weatherAttack, weatherDefense, weatherDiscoveryChance, type WeaponProficiency, type EquipmentPart } from "./legacy-rules";

export type AreaId = LegacyAreaId;
export type ItemKind = "weapon" | "armor" | "heal" | "stamina" | "antidote" | "material" | "trap";

export interface AreaDefinition {
  id: AreaId;
  name: string;
  grid: string;
  itemFind: number;
  encounter: number;
  initiative: number;
  shop?: boolean;
}

export interface GameItem {
  instanceId: string;
  catalogId: string;
  name: string;
  kind: ItemKind;
  power: number;
  durability: number;
  price: number;
  armorSlot?: EquipmentPart;
}

export interface EnemyState {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  rewardExp: number;
  rewardMoney: number;
}

export interface GamePlayerState {
  id: string;
  hp: number;
  maxHp: number;
  sp: number;
  maxSp: number;
  level: number;
  exp: number;
  money: number;
  area: AreaId;
  status: "normal" | "poisoned";
  tactic: "balanced" | "aggressive" | "defensive" | "scavenge";
  alive: boolean;
  kills: number;
  wave: number;
  inventory: GameItem[];
  weapon: GameItem | null;
  armor: GameItem | null;
  pendingItem: GameItem | null;
  enemy: EnemyState | null;
  proficiencies: Record<WeaponProficiency, number>;
  armorParts: Partial<Record<EquipmentPart, GameItem>>;
  teamId: string | null;
}

export interface CorpseState {
  id: string;
  playerId: string;
  area: AreaId;
  money: number;
  items: GameItem[];
}

export interface GameWorldState {
  mode: "standard" | "infinite";
  phase: "waiting" | "active" | "finished";
  cycle: number;
  turn: number;
  seed: number;
  forbidden: AreaId[];
  warningArea: AreaId | null;
  warningAreas: AreaId[];
  players: Record<string, GamePlayerState>;
  corpses: CorpseState[];
  winnerId: string | null;
  weatherId: number;
  teams: Record<string, string[]>;
  traps: Array<{ id: string; area: AreaId; owner: string; power: number }>;
}

export interface GameTransition {
  ok: boolean;
  world: GameWorldState;
  code?: string;
  event: { kind: string; playerId: string; text: string; targetId?: string };
}

export const GAME_AREAS: AreaDefinition[] = LEGACY_AREAS.map((area) => ({
  id: area.id, name: area.name, grid: area.grid,
  itemFind: area.itemFind, encounter: area.encounter, initiative: area.initiative,
  shop: "shop" in area && area.shop === true
}));

const catalog: Array<Omit<GameItem, "instanceId">> = [
  { catalogId: "folding_baton", name: "折叠短棍", kind: "weapon", power: 9, durability: 18, price: 0 },
  { catalogId: "signal_blade", name: "信号切断刃", kind: "weapon", power: 17, durability: 14, price: 520 },
  { catalogId: "loop_rifle", name: "轮回脉冲枪", kind: "weapon", power: 25, durability: 10, price: 980 },
  { catalogId: "fiber_vest", name: "纤维护甲", kind: "armor", power: 5, durability: 20, price: 420 },
  { catalogId: "station_shell", name: "站务员外壳", kind: "armor", power: 10, durability: 15, price: 850 },
  { catalogId: "healing_gel", name: "应急凝胶", kind: "heal", power: 35, durability: 1, price: 160 },
  { catalogId: "energy_cell", name: "体力电池", kind: "stamina", power: 45, durability: 1, price: 140 },
  { catalogId: "purifier", name: "净化针剂", kind: "antidote", power: 0, durability: 1, price: 120 },
  { catalogId: "helmet", name: "基础头盔", kind: "armor", armorSlot: "head", power: 3, durability: 15, price: 200 },
  { catalogId: "armguards", name: "防护臂甲", kind: "armor", armorSlot: "arms", power: 2, durability: 15, price: 180 },
  { catalogId: "legguards", name: "防护腿甲", kind: "armor", armorSlot: "legs", power: 3, durability: 15, price: 200 },
  { catalogId: "tripwire", name: "简易绊索陷阱", kind: "trap", power: 12, durability: 1, price: 120 },
  { catalogId: "rice_stew", name: "杂炊", kind: "material", power: 0, durability: 1, price: 35 },
  { catalogId: "matsutake", name: "松茸", kind: "material", power: 0, durability: 1, price: 60 },
  { catalogId: "curry", name: "咖喱", kind: "material", power: 0, durability: 1, price: 40 },
  { catalogId: "bread", name: "面包", kind: "material", power: 0, durability: 1, price: 30 },
  { catalogId: "matsutake_rice", name: "松茸御饭", kind: "heal", power: 120, durability: 10, price: 0 },
  { catalogId: "curry_bread", name: "咖喱面包", kind: "heal", power: 140, durability: 2, price: 0 }
];

const CRAFT_RECIPES = [
  { ingredients: ["rice_stew", "matsutake"], result: "matsutake_rice" },
  { ingredients: ["curry", "bread"], result: "curry_bread" }
] as const;
const areaById = (id: AreaId): AreaDefinition => GAME_AREAS.find((area) => area.id === id) ?? GAME_AREAS[1]!;
const clone = <T>(value: T): T => structuredClone(value);

function nextRandom(world: GameWorldState): number {
  world.seed = (Math.imul(world.seed, 1664525) + 1013904223) >>> 0;
  return world.seed / 4294967296;
}

function makeItem(world: GameWorldState, definition: Omit<GameItem, "instanceId">): GameItem {
  const suffix = Math.floor(nextRandom(world) * 0xffffff).toString(36);
  return { ...definition, instanceId: `${definition.catalogId}_${world.turn}_${suffix}` };
}

export function createGameWorld(seed = 20261028, mode: GameWorldState["mode"] = "infinite"): GameWorldState {
  return { mode, phase: "waiting", cycle: 1, turn: 0, seed: seed >>> 0, forbidden: [...LEGACY_MAP_RULES.startForbidden], warningArea: null, warningAreas: [], players: {}, corpses: [], winnerId: null, weatherId: 2, teams: {}, traps: [] };
}

function createPlayer(world: GameWorldState, playerId: string): GamePlayerState {
  return {
    id: playerId,
    hp: 100,
    maxHp: 100,
    sp: 300,
    maxSp: 300,
    level: 1,
    exp: 0,
    money: 300,
    area: "zone_1",
    status: "normal",
    tactic: "balanced",
    alive: true,
    kills: 0,
    wave: 1,
    inventory: [makeItem(world, catalog.find(({ catalogId }) => catalogId === "healing_gel")!), makeItem(world, catalog.find(({ catalogId }) => catalogId === "purifier")!)],
    weapon: makeItem(world, catalog[0]!),
    armor: null,
    pendingItem: null,
    enemy: null,
    proficiencies: { wp: 0, wk: 0, wg: 0, wc: 0, wd: 0, wf: 0 },
    armorParts: {},
    teamId: null
  };
}

function failure(world: GameWorldState, playerId: string, code: string, text: string): GameTransition {
  return { ok: false, world, code, event: { kind: "error", playerId, text } };
}

function success(world: GameWorldState, playerId: string, kind: string, text: string, targetId?: string): GameTransition {
  return { ok: true, world, event: { kind, playerId, text, ...(targetId ? { targetId } : {}) } };
}

function parseString(payload: unknown, key: string): string {
  return typeof payload === "object" && payload && typeof (payload as Record<string, unknown>)[key] === "string" ? (payload as Record<string, string>)[key]! : "";
}

function applyPoison(player: GamePlayerState): string {
  if (player.status !== "poisoned" || !player.alive) return "";
  player.hp = Math.max(0, player.hp - 5);
  if (player.hp === 0) player.alive = false;
  return " 中毒造成 5 点生命损失。";
}

function levelUp(player: GamePlayerState): string {
  let text = "";
  while (player.exp >= player.level * 100) {
    player.exp -= player.level * 100;
    player.level += 1;
    player.maxHp += 12;
    player.maxSp += 8;
    player.hp = player.maxHp;
    player.sp = player.maxSp;
    text += ` 等级提升至 ${player.level}。`;
  }
  return text;
}

function normalizeSavedWorldAreas(world: GameWorldState): GameWorldState {
  // Durable Objects created before this migration can still hold 6-region IDs.
  // Translate them without deleting a saved player, their inventory, or history.
  for (const player of Object.values(world.players)) {
    player.area = normalizeSavedArea(player.area);
    player.proficiencies ??= { wp: 0, wk: 0, wg: 0, wc: 0, wd: 0, wf: 0 };
    player.armorParts ??= {};
    player.teamId ??= null;
  }
  world.weatherId ??= 2;
  world.teams ??= {};
  world.traps ??= [];
  for (const corpse of world.corpses) corpse.area = normalizeSavedArea(corpse.area);
  world.forbidden = [...new Set((world.forbidden ?? []).map(normalizeSavedArea))];
  world.warningAreas = (world.warningAreas ?? (world.warningArea ? [world.warningArea] : [])).map(normalizeSavedArea);
  world.warningArea = world.warningAreas[0] ?? null;
  return world;
}

function advanceWorld(world: GameWorldState): string {
  world.turn += 1;
  let notice = "";
  // The prototype has a turn clock rather than a realtime game clock.
  // Preserve its pacing here, but restore the legacy four-area waves.
  if (world.turn % 8 === 5 && world.warningAreas.length === 0) {
    const available = GAME_AREAS.filter(({ id }) => !world.forbidden.includes(id)).map(({ id }) => id);
    for (let i = 0; i < LEGACY_MAP_RULES.forbiddenPerWave && available.length; i += 1) {
      const index = Math.floor(nextRandom(world) * available.length);
      world.warningAreas.push(available.splice(index, 1)[0]!);
    }
    world.warningArea = world.warningAreas[0] ?? null;
    if (world.warningAreas.length) notice = ` 禁区预告：${world.warningAreas.map((id) => areaById(id).name).join("、")}即将封锁。`;
  }
  if (world.turn % 8 === 0 && world.warningAreas.length) {
    const closed = [...world.warningAreas];
    world.forbidden.push(...closed);
    world.warningAreas = []; world.warningArea = null;
    for (const player of Object.values(world.players)) {
      if (player.alive && closed.includes(player.area)) { player.hp = 0; player.alive = false; }
    }
    notice = ` 新增禁区：${closed.map((id) => areaById(id).name).join("、")}。`;
    world.weatherId = Math.floor(nextRandom(world) * WEATHER.length);
    notice += ` 当前天气：${WEATHER[world.weatherId]!.name}。`;
    if (world.forbidden.length >= GAME_AREAS.length) {
      if (world.mode === "infinite") {
        world.cycle += 1;
        world.forbidden = [...LEGACY_MAP_RULES.startForbidden];
        notice += ` 轮回重置，进入第 ${world.cycle} 周目。`;
      } else {
        world.phase = "finished";
        notice += " 所有地区已封锁，游戏结束。";
      }
    }
  }
  const joined = Object.values(world.players);
  const alive = joined.filter(({ alive }) => alive);
  if (world.mode === "standard" && joined.length > 1 && alive.length <= 1) {
    world.phase = "finished";
    world.winnerId = alive[0]?.id ?? null;
    notice += world.winnerId ? " 对局结束，最后的幸存者已经产生。" : " 对局结束，无人生还。";
  }
  return notice;
}

function spawnEnemy(world: GameWorldState, player: GamePlayerState): EnemyState {
  const names = ["失真巡检员", "空壳乘客", "逆行执行体", "记忆猎犬"];
  const scale = player.level + player.wave + world.cycle - 2;
  const maxHp = 38 + scale * 12;
  return {
    id: `enemy_${world.turn}_${Math.floor(nextRandom(world) * 99999)}`,
    name: names[Math.floor(nextRandom(world) * names.length)]!,
    hp: maxHp,
    maxHp,
    attack: 7 + scale * 3,
    defense: 2 + scale,
    rewardExp: 35 + scale * 14,
    rewardMoney: 45 + scale * 20
  };
}

function combatNpc(world: GameWorldState, player: GamePlayerState): string {
  const enemy = player.enemy!;
  const weaponPower = player.weapon?.power ?? 3;
  const proficiency = detectWeaponFamily(player.weapon?.catalogId ?? "fist");
  player.proficiencies[proficiency] = Math.min(999, player.proficiencies[proficiency] + 1);
  const tacticAttack = player.tactic === "aggressive" ? 5 : player.tactic === "defensive" ? -2 : 0;
  const damage = Math.max(1, weatherAttack(weaponPower + player.level * 2 + tacticAttack + Math.floor(player.proficiencies[proficiency] / 20), world.weatherId) - weatherDefense(enemy.defense, world.weatherId) + Math.floor(nextRandom(world) * 6));
  enemy.hp = Math.max(0, enemy.hp - damage);
  if (player.weapon) {
    player.weapon.durability -= 1;
    if (player.weapon.durability <= 0) player.weapon = null;
  }
  let text = `你对${enemy.name}造成 ${damage} 点伤害。`;
  if (enemy.hp === 0) {
    player.exp += enemy.rewardExp;
    player.money += enemy.rewardMoney;
    player.kills += 1;
    player.wave += 1;
    player.enemy = null;
    text += ` 目标已清除，获得 ${enemy.rewardExp} 经验和 ${enemy.rewardMoney} LOOP。${levelUp(player)}`;
    return text;
  }
  const defense = weatherDefense((player.armor?.power ?? 0) + Object.values(player.armorParts).reduce((sum, part) => sum + (part?.power ?? 0), 0), world.weatherId) + (player.tactic === "defensive" ? 5 : player.tactic === "aggressive" ? -2 : 0);
  const counter = Math.max(1, enemy.attack - defense + Math.floor(nextRandom(world) * 5));
  player.hp = Math.max(0, player.hp - counter);
  if (player.armor) {
    player.armor.durability -= 1;
    if (player.armor.durability <= 0) player.armor = null;
  }
  if (player.hp === 0) player.alive = false;
  return `${text} ${enemy.name}反击造成 ${counter} 点伤害。`;
}

export function applyGameAction(input: GameWorldState | undefined, playerId: string, action: string, payload: unknown): GameTransition {
  const requestedMode = parseString(payload, "mode") === "standard" ? "standard" : "infinite";
  const world = normalizeSavedWorldAreas(clone(input ?? createGameWorld(20261028, requestedMode)));
  if (action === "game_enter") {
    if (!world.players[playerId] && Object.values(world.players).filter(({ alive }) => alive).length >= 8) {
      return failure(world, playerId, "room_full", "房间人数已满。 ");
    }
    if (!world.players[playerId]) world.players[playerId] = createPlayer(world, playerId);
    if (world.phase === "waiting") { world.phase = "active"; world.winnerId = null; }
    return success(world, playerId, "entered", world.mode === "standard" ? "已进入标准大逃杀。 " : "已进入无限试炼。 ");
  }
  const player = world.players[playerId];
  if (!player) return failure(world, playerId, "game_not_entered", "请先进入对局。 ");
  if (action === "game_chat") {
    const text = parseString(payload, "text").trim();
    if (!text || text.length > 200) return failure(world, playerId, "invalid_chat", "消息长度必须为 1–200 个字符。 ");
    return success(world, playerId, "chat", text);
  }
  if (action === "game_restart") {
    const wasFinished = world.phase === "finished";
    if (wasFinished) {
      for (const id of Object.keys(world.players)) world.players[id] = createPlayer(world, id);
      world.corpses = [];
    } else world.players[playerId] = createPlayer(world, playerId);
    world.phase = "active";
    world.winnerId = null;
    if (wasFinished || Object.values(world.players).every((entry) => entry.id === playerId || !entry.alive)) {
      world.cycle += 1;
      world.turn = 0;
      world.forbidden = [...LEGACY_MAP_RULES.startForbidden];
      world.warningAreas = [];
      world.warningArea = null;
    }
    return success(world, playerId, "restarted", "轮回重启，角色状态已重置。 ");
  }
  if (!player.alive) {
    return failure(world, playerId, "player_dead", "角色已死亡，请重新开始轮回。 ");
  }
  if (world.phase === "finished" && action !== "game_loot") return failure(world, playerId, "game_finished", "本局已经结束。 ");
  if (world.forbidden.includes(player.area)) {
    player.hp = 0; player.alive = false;
    return success(world, playerId, "zone_death", "你停留在禁区，轮回终止。 ");
  }

  let transition: GameTransition;
  if (action === "game_move") {
    const rawTo = parseString(payload, "to");
    const to = (PROTOTYPE_AREA_ALIASES[rawTo] ?? rawTo) as AreaId;
    if (!isLegacyAreaId(to) || player.area === to) return failure(world, playerId, "invalid_destination", "请选择其他有效地区。 ");
    if (world.forbidden.includes(to)) return failure(world, playerId, "forbidden_destination", "目标区域已经封锁。 ");
    if (player.enemy) return failure(world, playerId, "enemy_present", "遭遇敌人时无法移动，请先战斗或撤离。 ");
    if (player.sp <= 15) return failure(world, playerId, "insufficient_sp", "体力不足，无法移动。 ");
    player.sp -= 15; player.area = to;
    const trap = world.traps.find((entry) => entry.area === to && entry.owner !== playerId);
    if (trap && nextRandom(world) < 0.25) {
      player.hp = Math.max(0, player.hp - trap.power);
      if (player.hp === 0) player.alive = false;
      world.traps = world.traps.filter((entry) => entry.id !== trap.id);
    }
    transition = success(world, playerId, "moved", `消耗 15 点体力，移动到${areaById(to).name}。`);
  } else if (action === "game_search") {
    if (player.enemy || player.pendingItem) return failure(world, playerId, "unresolved_encounter", "请先处理当前发现物或敌人。 ");
    if (player.sp <= 15) return failure(world, playerId, "insufficient_sp", "体力不足，无法探索。 ");
    player.sp -= 15;
    const roll = nextRandom(world);
    const areaRules = areaById(player.area);
    const itemThreshold = Math.max(0.1, Math.min(0.8, weatherDiscoveryChance(player.tactic === "scavenge" ? 68 : 50, areaRules.itemFind, world.weatherId) / 100));
    const enemyThreshold = Math.min(0.98, Math.max(itemThreshold, (88 + areaRules.encounter + (WEATHER[world.weatherId] ?? WEATHER[2]).encounter) / 100));
    if (roll < itemThreshold) {
      const lootPool = catalog.slice(1);
      player.pendingItem = makeItem(world, lootPool[Math.floor(nextRandom(world) * lootPool.length)]!);
      transition = success(world, playerId, "found_item", `探索发现了${player.pendingItem.name}。`);
    } else if (roll < enemyThreshold) {
      player.enemy = spawnEnemy(world, player);
      transition = success(world, playerId, "found_enemy", `遭遇${player.enemy.name}。`);
    } else {
      const foundMoney = 40 + Math.floor(nextRandom(world) * 120);
      player.money += foundMoney;
      transition = success(world, playerId, "found_money", `发现 ${foundMoney} LOOP。`);
    }
  } else if (action === "game_pickup") {
    if (!player.pendingItem) return failure(world, playerId, "nothing_to_pickup", "当前没有可拾取物品。 ");
    if (player.inventory.length >= LEGACY_MAP_RULES.inventorySlots) return failure(world, playerId, "inventory_full", "背包已满，请先使用或丢弃物品。 ");
    const found = player.pendingItem; player.inventory.push(found); player.pendingItem = null;
    transition = success(world, playerId, "picked_up", `已拾取${found.name}。`);
  } else if (action === "game_discard") {
    const instanceId = parseString(payload, "instanceId");
    const before = player.inventory.length;
    player.inventory = player.inventory.filter((entry) => entry.instanceId !== instanceId);
    if (player.inventory.length === before) return failure(world, playerId, "item_not_found", "背包中没有该物品。 ");
    transition = success(world, playerId, "discarded", "物品已丢弃。 ");
  } else if (action === "game_equip") {
    const instanceId = parseString(payload, "instanceId");
    const index = player.inventory.findIndex((entry) => entry.instanceId === instanceId);
    const selected = player.inventory[index];
    if (!selected || (selected.kind !== "weapon" && selected.kind !== "armor")) return failure(world, playerId, "item_not_equippable", "该物品无法装备。 ");
    player.inventory.splice(index, 1);
    if (selected.kind === "weapon") { if (player.weapon) player.inventory.push(player.weapon); player.weapon = selected; }
    else if (selected.armorSlot && selected.armorSlot !== "body") {
      const previous = player.armorParts[selected.armorSlot];
      if (previous) player.inventory.push(previous);
      player.armorParts[selected.armorSlot] = selected;
    } else { if (player.armor) player.inventory.push(player.armor); player.armor = selected; }
    transition = success(world, playerId, "equipped", `已装备${selected.name}。`);
  } else if (action === "game_unequip") {
    const slot = parseString(payload, "slot");
    if (player.inventory.length >= LEGACY_MAP_RULES.inventorySlots) return failure(world, playerId, "inventory_full", "背包已满，无法卸下装备。 ");
    if (slot === "weapon" && player.weapon) {
      const selected = player.weapon; player.weapon = null; player.inventory.push(selected);
      transition = success(world, playerId, "unequipped", `已卸下${selected.name}。`);
    } else if (slot === "armor" && player.armor) {
      const selected = player.armor; player.armor = null; player.inventory.push(selected);
      transition = success(world, playerId, "unequipped", `已卸下${selected.name}。`);
    } else if (slot === "head" || slot === "arms" || slot === "legs") {
      const selected = player.armorParts[slot];
      if (!selected) return failure(world, playerId, "slot_empty", "该装备栏为空。 ");
      player.inventory.push(selected); delete player.armorParts[slot];
      transition = success(world, playerId, "unequipped", `已卸下${selected.name}。`);
    } else return failure(world, playerId, "slot_empty", "该装备栏为空。 ");
  } else if (action === "game_use") {
    const instanceId = parseString(payload, "instanceId");
    const index = player.inventory.findIndex((entry) => entry.instanceId === instanceId);
    const selected = player.inventory[index];
    if (!selected || !["heal", "stamina", "antidote"].includes(selected.kind)) return failure(world, playerId, "item_not_usable", "该物品无法使用。 ");
    if (selected.durability <= 1) player.inventory.splice(index, 1);
    else selected.durability -= 1;
    if (selected.kind === "heal") player.hp = Math.min(player.maxHp, player.hp + selected.power);
    if (selected.kind === "stamina") player.sp = Math.min(player.maxSp, player.sp + selected.power);
    if (selected.kind === "antidote") player.status = "normal";
    transition = success(world, playerId, "used_item", `已使用${selected.name}。`);
  } else if (action === "game_attack") {
    const targetId = parseString(payload, "targetId");
    if (targetId) {
      if (world.mode !== "standard") return failure(world, playerId, "pvp_disabled", "无限试炼中无法攻击其他玩家。 ");
      const target = world.players[targetId];
      if (player.teamId && target?.teamId === player.teamId) return failure(world, playerId, "friendly_fire", "不能攻击同队玩家。 ");
      if (!target?.alive || target.area !== player.area || targetId === playerId) return failure(world, playerId, "invalid_target", "目标不在当前区域。 ");
      const attackBonus = player.tactic === "aggressive" ? 5 : player.tactic === "defensive" ? -2 : 0;
      const defenseBonus = target.tactic === "defensive" ? 5 : target.tactic === "aggressive" ? -2 : 0;
      const damage = Math.max(1, weatherAttack((player.weapon?.power ?? 3) + player.level * 2 + attackBonus, world.weatherId) - weatherDefense((target.armor?.power ?? 0) + Object.values(target.armorParts).reduce((sum, part) => sum + (part?.power ?? 0), 0), world.weatherId) - defenseBonus + Math.floor(nextRandom(world) * 6));
      target.hp = Math.max(0, target.hp - damage);
      const weaponFamily = detectWeaponFamily(player.weapon?.catalogId ?? "fist");
      player.proficiencies[weaponFamily] += 1;
      if (player.weapon) { player.weapon.durability -= 1; if (player.weapon.durability <= 0) player.weapon = null; }
      if (target.hp === 0) {
        target.alive = false; player.kills += 1; player.exp += 80;
        const corpseMoney = Math.floor(target.money / 2); target.money -= corpseMoney;
        const corpseItems = [...target.inventory, ...(target.weapon ? [target.weapon] : []), ...(target.armor ? [target.armor] : []), ...Object.values(target.armorParts).filter((part): part is GameItem => Boolean(part))];
        target.inventory = []; target.weapon = null; target.armor = null; target.armorParts = {};
        world.corpses.push({ id: `corpse_${world.turn}_${targetId}`, playerId: targetId, area: target.area, money: corpseMoney, items: corpseItems });
      }
      transition = success(world, playerId, "pvp_attack", `对目标造成 ${damage} 点伤害。${target.alive ? "" : ` 目标已出局，遗留了可搜索的战利品。${levelUp(player)}`}`, targetId);
    } else {
      if (!player.enemy) return failure(world, playerId, "no_enemy", "当前没有可攻击的敌人。 ");
      transition = success(world, playerId, "npc_attack", combatNpc(world, player));
    }
  } else if (action === "game_rest") {
    if (player.enemy) return failure(world, playerId, "enemy_present", "遭遇敌人时无法休息。 ");
    player.sp = Math.min(player.maxSp, player.sp + 30);
    player.hp = Math.min(player.maxHp, player.hp + 10);
    transition = success(world, playerId, "rested", "短暂休整，恢复 30 体力和 10 生命。 ");
  } else if (action === "game_shop_buy") {
    if (!areaById(player.area).shop) return failure(world, playerId, "shop_unavailable", "当前区域没有商店。 ");
    if (player.inventory.length >= LEGACY_MAP_RULES.inventorySlots) return failure(world, playerId, "inventory_full", "背包已满。 ");
    const catalogId = parseString(payload, "catalogId");
    const selected = catalog.find((entry) => entry.catalogId === catalogId && entry.price > 0);
    if (!selected) return failure(world, playerId, "unknown_product", "商店没有这个物品。 ");
    if (player.money < selected.price) return failure(world, playerId, "insufficient_money", "LOOP 不足。 ");
    player.money -= selected.price; player.inventory.push(makeItem(world, selected));
    transition = success(world, playerId, "purchased", `购买了${selected.name}。`);
  } else if (action === "game_shop_sell") {
    if (!areaById(player.area).shop) return failure(world, playerId, "shop_unavailable", "当前区域没有商店。 ");
    const instanceId = parseString(payload, "instanceId");
    const index = player.inventory.findIndex((entry) => entry.instanceId === instanceId);
    const selected = player.inventory[index];
    if (!selected) return failure(world, playerId, "item_not_found", "背包中没有该物品。 ");
    const value = Math.max(10, Math.floor(selected.price * 0.5));
    player.inventory.splice(index, 1); player.money += value;
    transition = success(world, playerId, "sold", `出售${selected.name}，获得 ${value} LOOP。`);
  } else if (action === "game_loot") {
    const corpseId = parseString(payload, "corpseId");
    const corpse = world.corpses.find((entry) => entry.id === corpseId && entry.area === player.area);
    if (!corpse) return failure(world, playerId, "corpse_not_found", "当前区域没有这具遗留物。 ");
    const instanceId = parseString(payload, "instanceId");
    if (!instanceId && corpse.money > 0) {
      const amount = corpse.money; corpse.money = 0; player.money += amount;
      transition = success(world, playerId, "looted_money", `从遗留物中取得 ${amount} LOOP。`);
    } else {
      if (player.inventory.length >= LEGACY_MAP_RULES.inventorySlots) return failure(world, playerId, "inventory_full", "背包已满。 ");
      const index = corpse.items.findIndex((entry) => entry.instanceId === instanceId);
      const selected = corpse.items[index];
      if (!selected) return failure(world, playerId, "loot_not_found", "遗留物中没有该物品。 ");
      corpse.items.splice(index, 1); player.inventory.push(selected);
      transition = success(world, playerId, "looted_item", `从遗留物中取得${selected.name}。`);
    }
    if (corpse.money === 0 && corpse.items.length === 0) world.corpses = world.corpses.filter(({ id }) => id !== corpse.id);
  } else if (action === "game_team_create") {
    if (player.teamId) return failure(world, playerId, "already_in_team", "你已经加入队伍。 ");
    if (player.sp <= TEAM_RULES.createSp) return failure(world, playerId, "insufficient_sp", "组队需要 200 点体力。 ");
    const teamId = `team_${playerId}_${world.cycle}`;
    if (world.teams[teamId]) return failure(world, playerId, "team_exists", "队伍已存在。 ");
    player.sp -= TEAM_RULES.createSp;
    player.teamId = teamId;
    world.teams[teamId] = [playerId];
    transition = success(world, playerId, "team_created", "创建队伍成功，其他玩家可以选择加入。 ");
  } else if (action === "game_team_join") {
    if (player.teamId) return failure(world, playerId, "already_in_team", "你已经加入队伍。 ");
    const teamId = parseString(payload, "teamId");
    const members = world.teams[teamId];
    if (!members) return failure(world, playerId, "team_missing", "没有找到该队伍。 ");
    if (members.length >= TEAM_RULES.maxMembers) return failure(world, playerId, "team_full", "队伍人数已满。 ");
    if (player.sp <= TEAM_RULES.joinSp) return failure(world, playerId, "insufficient_sp", "加入队伍需要 100 点体力。 ");
    player.sp -= TEAM_RULES.joinSp;
    members.push(playerId);
    player.teamId = teamId;
    transition = success(world, playerId, "team_joined", "已加入队伍。 ");
  } else if (action === "game_team_leave") {
    if (!player.teamId) return failure(world, playerId, "team_missing", "你没有加入队伍。 ");
    const oldId = player.teamId;
    world.teams[oldId] = (world.teams[oldId] ?? []).filter((id) => id !== playerId);
    if (world.teams[oldId].length === 0) delete world.teams[oldId];
    player.teamId = null;
    transition = success(world, playerId, "team_left", "已经退出队伍。 ");
  } else if (action === "game_craft") {
    if (player.enemy) return failure(world, playerId, "enemy_present", "战斗中不能合成物品。 ");
    const resultId = parseString(payload, "result");
    const recipe = CRAFT_RECIPES.find((entry) => entry.result === resultId);
    if (!recipe) return failure(world, playerId, "unknown_recipe", "合成配方不存在。 ");
    const used = new Set<number>();
    for (const ingredient of recipe.ingredients) {
      const index = player.inventory.findIndex((item, i) => !used.has(i) && item.catalogId === ingredient);
      if (index < 0) return failure(world, playerId, "missing_ingredient", "缺少合成材料。 ");
      used.add(index);
    }
    const product = catalog.find((item) => item.catalogId === recipe.result);
    if (!product) return failure(world, playerId, "unknown_recipe", "配方结果不存在。 ");
    for (const index of [...used].sort((a, b) => b - a)) player.inventory.splice(index, 1);
    const produced = makeItem(world, product);
    player.inventory.push(produced);
    transition = success(world, playerId, "crafted", `合成成功：${produced.name}。`);
  } else if (action === "game_trap_place") {
    if (player.enemy) return failure(world, playerId, "enemy_present", "战斗中不能设置陷阱。 ");
    const instanceId = parseString(payload, "instanceId");
    const index = player.inventory.findIndex((item) => item.instanceId === instanceId && item.kind === "trap");
    if (index < 0) return failure(world, playerId, "trap_missing", "背包中没有可设置的陷阱。 ");
    const selected = player.inventory.splice(index, 1)[0]!;
    world.traps.push({ id: selected.instanceId, area: player.area, owner: playerId, power: selected.power });
    transition = success(world, playerId, "trap_placed", `已在${areaById(player.area).name}设置陷阱。`);
  } else if (action === "game_trap_detect") {
    const traps = world.traps.filter((trap) => trap.area === player.area);
    transition = success(world, playerId, "trap_detected", `当前地区探测到 ${traps.length} 个陷阱。`);
  } else if (action === "game_tactic") {
    const tactic = parseString(payload, "tactic");
    if (!(["balanced", "aggressive", "defensive", "scavenge"] as string[]).includes(tactic)) return failure(world, playerId, "invalid_tactic", "无效战术。 ");
    player.tactic = tactic as GamePlayerState["tactic"];
    const labels = { balanced: "均衡", aggressive: "强攻", defensive: "防守", scavenge: "搜刮" };
    transition = success(world, playerId, "tactic_changed", `战术切换为${labels[player.tactic]}。`);
  } else if (action === "game_flee") {
    if (!player.enemy) return failure(world, playerId, "no_enemy", "当前没有需要撤离的敌人。 ");
    if (nextRandom(world) < 0.65) { player.enemy = null; transition = success(world, playerId, "fled", "成功脱离战斗。 "); }
    else {
      const damage = Math.max(1, player.enemy.attack - (player.armor?.power ?? 0) - Object.values(player.armorParts).reduce((sum, part) => sum + (part?.power ?? 0), 0));
      player.hp = Math.max(0, player.hp - damage); if (player.hp === 0) player.alive = false;
      transition = success(world, playerId, "flee_failed", `撤离失败，受到 ${damage} 点伤害。`);
    }
  } else {
    return failure(world, playerId, "unsupported_game_action", "不支持的游戏行动。 ");
  }

  if (transition.ok) {
    transition.event.text += applyPoison(player);
    transition.event.text += advanceWorld(world);
  }
  return transition;
}

export function getGameView(world: GameWorldState, playerId: string) {
  world = normalizeSavedWorldAreas(clone(world));
  const player = world.players[playerId];
  const ranking = Object.values(world.players)
    .sort((a, b) => Number(b.alive) - Number(a.alive) || b.kills - a.kills || b.level - a.level || b.wave - a.wave || a.id.localeCompare(b.id))
    .map(({ id, alive, kills, level, wave }, index) => ({ rank: index + 1, id, alive, kills, level, wave }));
  return {
    player,
    world: { mode: world.mode, phase: world.phase, cycle: world.cycle, turn: world.turn, forbidden: world.forbidden, warningArea: world.warningArea, warningAreas: world.warningAreas, winnerId: world.winnerId, weatherId: world.weatherId, weather: WEATHER[world.weatherId] ?? WEATHER[2], teams: world.teams },
    areas: GAME_AREAS,
    shop: catalog.filter(({ price }) => price > 0),
    recipes: CRAFT_RECIPES,
    corpses: world.corpses.filter((corpse) => player && corpse.area === player.area),
    targets: world.mode === "standard" ? Object.values(world.players).filter((target) => target.id !== playerId && target.alive && player && target.area === player.area).map(({ id, hp, maxHp, level }) => ({ id, hp, maxHp, level })) : [],
    ranking
  };
}
