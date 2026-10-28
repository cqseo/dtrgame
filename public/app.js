const byId = (id) => document.getElementById(id);
const networkState = byId("network-state");
const dbState = byId("db-state");
const socketState = byId("socket-state");
const systemMessage = byId("system-message");
const authStorageKey = "mugen-loop-auth-v1";
const guestStorageKey = "mugen-loop-guest-v1";
let authSession = null;
let tutorialSocket = null;
let tutorialState = null;
let gameSocket = null;
let gameView = null;
let activeGameRoom = null;
let guestId = sessionStorage.getItem(guestStorageKey);
if (!guestId) {
  guestId = crypto.randomUUID();
  sessionStorage.setItem(guestStorageKey, guestId);
}

function setAuthSession(session) {
  authSession = session?.access_token ? session : null;
  if (authSession) sessionStorage.setItem(authStorageKey, JSON.stringify(authSession));
  else sessionStorage.removeItem(authStorageKey);
  renderAuth();
}

function renderAuth() {
  const email = byId("login-email");
  const password = byId("login-password");
  const actions = document.querySelector(".auth-actions");
  const logout = byId("logout-button");
  const note = byId("login-note");
  const loggedIn = Boolean(authSession?.access_token);
  email.disabled = loggedIn; password.disabled = loggedIn;
  actions.hidden = loggedIn; logout.hidden = !loggedIn;
  note.classList.remove("is-error");
  if (loggedIn) {
    email.value = authSession.user?.email ?? ""; password.value = "";
    note.textContent = `已验证：${authSession.user?.email ?? "轮回玩家"}`;
  } else {
    note.textContent = "玩法开发阶段可直接以游客身份进入；正式账号稍后统一完善。";
  }
}

function setAuthBusy(busy) {
  document.querySelectorAll("#login-form button").forEach((button) => { button.disabled = busy; });
  byId("login-form").setAttribute("aria-busy", String(busy));
}

async function authRequest(mode, payload = {}, accessToken = "") {
  const response = await fetch(`/api/auth/${mode}`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {})
    },
    body: mode === "logout" ? undefined : JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.msg || data.message || data.error_description || data.error || "认证请求失败");
  return data;
}

function normalizeSession(data) {
  if (!data?.access_token) return null;
  return { ...data, expires_at: data.expires_at ?? Math.floor(Date.now() / 1000) + (data.expires_in ?? 3600) };
}

async function restoreAuth() {
  try { authSession = JSON.parse(sessionStorage.getItem(authStorageKey) || "null"); } catch { authSession = null; }
  if (authSession?.refresh_token && (authSession.expires_at ?? 0) <= Math.floor(Date.now() / 1000) + 60) {
    try { setAuthSession(normalizeSession(await authRequest("refresh", { refreshToken: authSession.refresh_token }))); }
    catch { setAuthSession(null); }
  } else renderAuth();
}

function updateClock() {
  byId("server-clock").textContent = new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
  }).format(new Date());
}

function checkSocket() {
  return new Promise((resolve) => {
    const protocol = location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(`${protocol}//${location.host}/api/rooms/lobby-preview/socket`);
    const timeout = window.setTimeout(() => { socket.close(); socketState.textContent = "超时"; resolve(); }, 5000);
    socket.addEventListener("open", () => socket.send(JSON.stringify({ type: "ping", at: Date.now() })));
    socket.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "pong") {
          socketState.textContent = "已连接"; socketState.className = "mint";
          clearTimeout(timeout); socket.close(); resolve();
        }
      } catch { /* Ignore non-protocol frames and wait for pong. */ }
    });
    socket.addEventListener("error", () => { clearTimeout(timeout); socketState.textContent = "异常"; resolve(); }, { once: true });
  });
}

function observeRoom(roomId, label) {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  if (roomId === "tutorial" && tutorialSocket) tutorialSocket.close();
  if ((roomId === "infinite" || roomId === "standard") && gameSocket) gameSocket.close();
  const socket = new WebSocket(`${protocol}//${location.host}/api/rooms/${roomId}/socket`);
  if (roomId === "tutorial") tutorialSocket = socket;
  if (roomId === "infinite" || roomId === "standard") { gameSocket = socket; activeGameRoom = roomId; }
  const timeout = window.setTimeout(() => { socket.close(); systemMessage.textContent = `${label}身份验证超时，请重试。`; }, 8000);
  systemMessage.textContent = `正在验证 ${label} 的玩家身份……`;
  const expectedPlayerId = authSession?.user?.id ?? `guest:${guestId}`;
  socket.addEventListener("open", () => socket.send(JSON.stringify(authSession?.access_token
    ? { type: "auth", accessToken: authSession.access_token }
    : { type: "guest", guestId })));
  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "room_event" && message.event?.type === "player_joined" && message.event.player?.id === expectedPlayerId) {
        clearTimeout(timeout); systemMessage.textContent = `${label}身份验证成功，房间状态已同步。`;
        if (roomId === "tutorial") {
          byId("tutorial-console").hidden = false;
          sendTutorialAction("tutorial_start");
          byId("tutorial-console").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        } else if (roomId === "infinite" || roomId === "standard") {
          byId("game-console").hidden = false;
          byId("game-console-title").textContent = roomId === "standard" ? "标准大逃杀控制台" : "无限试炼控制台";
          sendGameAction("game_enter", { mode: roomId });
          byId("game-console").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
        } else socket.close();
      } else if (message.type === "tutorial_state") {
        renderTutorial(message.state, message.log, message.error);
      } else if (message.type === "room_event" && message.event?.type === "action" && message.event.tutorial) {
        renderTutorial(message.event.tutorial, message.event.log);
      } else if (message.type === "game_state") {
        renderGame(message.view, message.log, message.error, message.history);
      } else if (message.type === "error" && message.code === "auth_invalid") {
        clearTimeout(timeout); setAuthSession(null); systemMessage.textContent = "登录状态已失效，请重新登录。"; socket.close();
      }
    } catch { /* Ignore malformed frames. */ }
  });
  socket.addEventListener("error", () => { clearTimeout(timeout); systemMessage.textContent = `${label}实时通道连接失败。`; }, { once: true });
}

function sendGameAction(action, payload) {
  if (!gameSocket || gameSocket.readyState !== WebSocket.OPEN) {
    byId("game-notice").textContent = "对局通道未连接，请重新进入无限试炼。";
    return;
  }
  gameSocket.send(JSON.stringify({ type: "action", commandId: crypto.randomUUID(), action, ...(payload ? { payload } : {}) }));
}

function appendGameLog(text, isError = false) {
  if (!text) return;
  const entry = document.createElement("li");
  entry.textContent = text;
  if (isError) entry.className = "coral";
  const log = byId("game-log");
  log.prepend(entry);
  while (log.children.length > 20) log.lastElementChild.remove();
}

function actionButton(label, onClick, className = "") {
  const button = document.createElement("button");
  button.type = "button"; button.textContent = label; button.className = className; button.addEventListener("click", onClick);
  return button;
}

function renderGame(view, log = "对局状态已同步。", error = "", history = []) {
  if (!view?.player) return;
  gameView = view;
  const { player, world, areas, shop, targets, corpses } = view;
  const area = areas.find(({ id }) => id === player.area);
  byId("game-hp").textContent = `${player.hp} / ${player.maxHp}`;
  byId("game-sp").textContent = `${player.sp} / ${player.maxSp}`;
  byId("game-level").textContent = player.level;
  byId("game-exp").textContent = `${player.exp} / ${player.level * 100}`;
  byId("game-money").textContent = player.money;
  byId("game-wave").textContent = player.wave;
  byId("game-kills").textContent = player.kills;
  byId("game-cycle").textContent = world.cycle;
  byId("game-area").textContent = area?.name ?? player.area;
  byId("game-phase").textContent = !player.alive ? "已死亡" : world.phase === "finished" ? "已结算" : `TURN ${world.turn}`;
  const warning = world.warningArea === player.area;
  byId("game-zone").textContent = world.forbidden.includes(player.area) ? "禁区" : warning ? "即将封锁" : "安全区域";
  byId("game-zone").className = warning || world.forbidden.includes(player.area) ? "coral" : "mint";
  byId("game-notice").textContent = error ? `${log}（${error}）` : log;
  if (!byId("game-log").children.length && history.length) {
    [...history].reverse().forEach((entry) => appendGameLog(entry.kind === "chat" ? `玩家：${entry.text}` : entry.text));
  }
  appendGameLog(log, Boolean(error));

  const map = byId("game-map"); map.replaceChildren();
  for (const neighborId of area?.neighbors ?? []) {
    const destination = areas.find(({ id }) => id === neighborId);
    const closed = world.forbidden.includes(neighborId);
    const button = actionButton(closed ? `${destination.name} · 禁区` : destination.name, () => sendGameAction("game_move", { to: neighborId }), world.warningArea === neighborId || closed ? "warn" : "");
    button.disabled = closed || !player.alive || Boolean(player.enemy);
    map.append(button);
  }

  const encounter = byId("game-encounter");
  if (player.enemy) encounter.textContent = `${player.enemy.name} · HP ${player.enemy.hp}/${player.enemy.maxHp} · 攻击 ${player.enemy.attack} · 防御 ${player.enemy.defense}`;
  else if (player.pendingItem) encounter.textContent = `发现物：${player.pendingItem.name} · ${player.pendingItem.kind} · 效果 ${player.pendingItem.power}`;
  else encounter.textContent = "暂未发现敌人或物品。";

  const availability = {
    game_search: player.alive && !player.enemy && !player.pendingItem,
    game_attack: player.alive && Boolean(player.enemy),
    game_flee: player.alive && Boolean(player.enemy),
    game_pickup: player.alive && Boolean(player.pendingItem),
    game_rest: player.alive && !player.enemy,
    game_restart: !player.alive || world.phase === "finished"
  };
  document.querySelectorAll("[data-game-action]").forEach((button) => { button.disabled = !availability[button.dataset.gameAction]; });

  const equipment = byId("game-equipment"); equipment.replaceChildren();
  const equipmentText = document.createElement("span");
  equipmentText.textContent = `武器：${player.weapon ? `${player.weapon.name}（威力 ${player.weapon.power} / 耐久 ${player.weapon.durability}）` : "徒手"}　护甲：${player.armor ? `${player.armor.name}（防御 ${player.armor.power} / 耐久 ${player.armor.durability}）` : "无"}　状态：${player.status === "poisoned" ? "中毒" : "正常"}`;
  equipment.append(equipmentText);
  if (player.weapon) equipment.append(actionButton("卸下武器", () => sendGameAction("game_unequip", { slot: "weapon" })));
  if (player.armor) equipment.append(actionButton("卸下护甲", () => sendGameAction("game_unequip", { slot: "armor" })));
  const inventory = byId("game-inventory"); inventory.replaceChildren();
  if (!player.inventory.length) inventory.textContent = "背包为空。";
  for (const item of player.inventory) {
    const row = document.createElement("div"); row.className = "inventory-row";
    const info = document.createElement("div");
    const name = document.createElement("strong"); name.textContent = item.name;
    const detail = document.createElement("small"); detail.textContent = ` ${item.kind} · 效果 ${item.power} · 耐久 ${item.durability}`;
    info.append(name, detail);
    const controls = document.createElement("div"); controls.className = "inventory-controls";
    if (["weapon", "armor"].includes(item.kind)) controls.append(actionButton("装备", () => sendGameAction("game_equip", { instanceId: item.instanceId })));
    if (["heal", "stamina", "antidote"].includes(item.kind)) controls.append(actionButton("使用", () => sendGameAction("game_use", { instanceId: item.instanceId })));
    if (area?.shop) controls.append(actionButton("出售", () => sendGameAction("game_shop_sell", { instanceId: item.instanceId })));
    controls.append(actionButton("丢弃", () => sendGameAction("game_discard", { instanceId: item.instanceId })));
    row.append(info, controls); inventory.append(row);
  }

  const shopPanel = byId("game-shop"); shopPanel.hidden = !area?.shop;
  const shopList = byId("game-shop-list"); shopList.replaceChildren();
  if (area?.shop) for (const product of shop) {
    const row = document.createElement("div"); row.className = "shop-row";
    const info = document.createElement("div");
    const name = document.createElement("strong"); name.textContent = product.name;
    const detail = document.createElement("small"); detail.textContent = ` ${product.kind} · 效果 ${product.power} · ${product.price} LOOP`;
    info.append(name, detail);
    const buy = actionButton("购买", () => sendGameAction("game_shop_buy", { catalogId: product.catalogId }));
    buy.disabled = !player.alive || player.money < product.price || player.inventory.length >= 7;
    row.append(info, buy); shopList.append(row);
  }

  const targetPanel = byId("game-targets"); targetPanel.hidden = targets.length === 0;
  const targetList = byId("game-target-list"); targetList.replaceChildren();
  for (const target of targets) targetList.append(actionButton(`Lv.${target.level} 玩家 · HP ${target.hp}/${target.maxHp}`, () => sendGameAction("game_attack", { targetId: target.id })));

  document.querySelectorAll("[data-game-tactic]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.gameTactic === player.tactic);
    button.disabled = !player.alive;
  });

  const corpsePanel = byId("game-corpses"); corpsePanel.hidden = corpses.length === 0;
  const corpseList = byId("game-corpse-list"); corpseList.replaceChildren();
  for (const corpse of corpses) {
    const row = document.createElement("div"); row.className = "corpse-row";
    const info = document.createElement("div");
    const title = document.createElement("strong"); title.textContent = "玩家遗留物";
    const detail = document.createElement("small"); detail.textContent = ` ${corpse.money} LOOP · ${corpse.items.length} 件物品`;
    info.append(title, detail);
    const controls = document.createElement("div"); controls.className = "inventory-controls";
    if (corpse.money > 0) controls.append(actionButton("取 LOOP", () => sendGameAction("game_loot", { corpseId: corpse.id })));
    for (const item of corpse.items) controls.append(actionButton(`取 ${item.name}`, () => sendGameAction("game_loot", { corpseId: corpse.id, instanceId: item.instanceId })));
    row.append(info, controls); corpseList.append(row);
  }
}

function sendTutorialAction(action) {
  if (!tutorialSocket || tutorialSocket.readyState !== WebSocket.OPEN) {
    byId("tutorial-log").textContent = "教程通道未连接，请重新点击“观测”。";
    return;
  }
  const payload = action === "tutorial_move" ? { to: "旧站台" } : undefined;
  tutorialSocket.send(JSON.stringify({
    type: "action",
    commandId: crypto.randomUUID(),
    action,
    ...(payload ? { payload } : {})
  }));
}

function renderTutorial(state, log = "状态已同步。", error = "") {
  tutorialState = state;
  byId("tutorial-hp").textContent = `${state.hp} / ${state.maxHp}`;
  byId("tutorial-sp").textContent = `${state.sp} / ${state.maxSp}`;
  byId("tutorial-area").textContent = state.area;
  byId("tutorial-condition").textContent = state.status === "poisoned" ? "中毒" : "正常";
  byId("tutorial-condition").className = state.status === "poisoned" ? "coral" : "mint";
  byId("tutorial-objective").textContent = state.objective;
  byId("tutorial-log").textContent = error ? `${log}（${error}）` : log;
  byId("tutorial-status").textContent = state.completed ? "已完成" : `STEP ${state.step + 1}`;
  const enabledAt = {
    tutorial_move: [0], tutorial_search: [1, 3], tutorial_pickup: [2, 4], tutorial_use_ration: [5], tutorial_use_purifier: [6]
  };
  document.querySelectorAll("[data-tutorial-action]").forEach((button) => {
    button.disabled = state.completed || !enabledAt[button.dataset.tutorialAction].includes(state.step);
  });
}

async function checkWorker() {
  const refreshButton = byId("refresh-rooms");
  refreshButton.disabled = true;
  refreshButton.setAttribute("aria-busy", "true");
  networkState.className = "net-state";
  networkState.lastElementChild.textContent = "连接中";
  dbState.textContent = "检测中"; socketState.textContent = "检测中";
  systemMessage.textContent = "正在读取边缘节点状态……";
  try {
    const [healthResponse, catalogResponse, tutorialResponse, standardResponse, infiniteResponse] = await Promise.all([
      fetch("/api/health", { cache: "no-store" }), fetch("/api/catalog", { cache: "no-store" }),
      fetch("/api/rooms/tutorial/state", { cache: "no-store" }), fetch("/api/rooms/standard/state", { cache: "no-store" }),
      fetch("/api/rooms/infinite/state", { cache: "no-store" })
    ]);
    if (!healthResponse.ok) throw new Error("health_failed");
    const health = await healthResponse.json();
    const catalog = catalogResponse.ok ? await catalogResponse.json() : { items: [] };
    const tutorialRoom = tutorialResponse.ok ? await tutorialResponse.json() : { connected: 0 };
    const standardRoom = standardResponse.ok ? await standardResponse.json() : { alive: 0, turn: 0 };
    const infiniteRoom = infiniteResponse.ok ? await infiniteResponse.json() : { alive: 0, turn: 0 };
    networkState.classList.add("is-online"); networkState.lastElementChild.textContent = "边缘在线";
    dbState.textContent = health.dependencies.supabase ? "已连接" : "待配置";
    dbState.className = health.dependencies.supabase ? "mint" : "";
    systemMessage.textContent = `Worker 正常 · 商品目录 ${catalog.items?.length ?? 0} 项 · Stripe ${health.dependencies.stripe ? "已连接" : "待接入"}`;
    byId("tutorial-count").textContent = `${Math.min(tutorialRoom.connected ?? 0, 1)} / 1`;
    byId("standard-count").textContent = `${standardRoom.alive ?? 0} / 8`;
    byId("standard-turn").textContent = `TURN ${standardRoom.turn ?? 0}`;
    byId("infinite-count").textContent = `${infiniteRoom.alive ?? 0} / 8`;
    byId("infinite-turn").textContent = `TURN ${infiniteRoom.turn ?? 0}`;
    await checkSocket();
  } catch {
    networkState.classList.add("is-offline"); networkState.lastElementChild.textContent = "连接失败";
    dbState.textContent = "未知"; socketState.textContent = "未知";
    systemMessage.textContent = "边缘节点暂时无法响应，请稍后重新检测。";
  } finally {
    refreshButton.disabled = false;
    refreshButton.removeAttribute("aria-busy");
  }
}

byId("refresh-rooms").addEventListener("click", checkWorker);
document.querySelectorAll(".room-action").forEach((button) => button.addEventListener("click", () => {
  const label = button.dataset.room === "tutorial" ? "教程轮回" : button.dataset.room === "standard" ? "标准大逃杀" : "无限试炼";
  observeRoom(button.dataset.room, label);
}));
byId("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const note = byId("login-note"); setAuthBusy(true); note.classList.remove("is-error"); note.textContent = "正在验证账号……";
  try {
    const data = await authRequest("login", { email: byId("login-email").value, password: byId("login-password").value });
    setAuthSession(normalizeSession(data));
  } catch (error) {
    note.classList.add("is-error"); note.textContent = error.message === "invalid_credentials" ? "邮箱或密码不正确。" : `登录失败：${error.message}`;
  } finally { setAuthBusy(false); }
});

byId("signup-button").addEventListener("click", async () => {
  const form = byId("login-form"); if (!form.reportValidity()) return;
  const note = byId("login-note"); setAuthBusy(true); note.classList.remove("is-error"); note.textContent = "正在创建测试账号……";
  try {
    const data = await authRequest("signup", { email: byId("login-email").value, password: byId("login-password").value });
    const session = normalizeSession(data);
    if (session) setAuthSession(session);
    else note.textContent = "账号已创建，请查收验证邮件后再登录。正式开放前需要配置自有 SMTP。";
  } catch (error) {
    note.classList.add("is-error"); note.textContent = `注册失败：${error.message}`;
  } finally { setAuthBusy(false); }
});

byId("logout-button").addEventListener("click", async () => {
  const token = authSession?.access_token; setAuthBusy(true);
  try { if (token) await authRequest("logout", {}, token); } catch { /* Local logout still clears the session. */ }
  finally { setAuthSession(null); setAuthBusy(false); }
});

document.querySelectorAll("[data-tutorial-action]").forEach((button) => button.addEventListener("click", () => {
  sendTutorialAction(button.dataset.tutorialAction);
}));

document.querySelectorAll("[data-game-action]").forEach((button) => button.addEventListener("click", () => {
  sendGameAction(button.dataset.gameAction);
}));

document.querySelectorAll("[data-game-tactic]").forEach((button) => button.addEventListener("click", () => {
  sendGameAction("game_tactic", { tactic: button.dataset.gameTactic });
}));

byId("game-chat-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = byId("game-chat-input");
  const text = input.value.trim();
  if (text) { sendGameAction("game_chat", { text }); input.value = ""; }
});

updateClock(); setInterval(updateClock, 1000); restoreAuth(); checkWorker();
