const byId = (id) => document.getElementById(id);
const networkState = byId("network-state");
const dbState = byId("db-state");
const socketState = byId("socket-state");
const systemMessage = byId("system-message");
const authStorageKey = "mugen-loop-auth-v1";
let authSession = null;

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
    note.textContent = "测试账号使用 Supabase 安全认证；新账号可能需要邮箱确认。";
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
  if (!authSession?.access_token) {
    systemMessage.textContent = "请先在右侧登录，再进入房间观测。";
    byId("login-email").focus();
    return;
  }
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  const socket = new WebSocket(`${protocol}//${location.host}/api/rooms/${roomId}/socket`);
  const timeout = window.setTimeout(() => { socket.close(); systemMessage.textContent = `${label}身份验证超时，请重试。`; }, 8000);
  systemMessage.textContent = `正在验证 ${label} 的玩家身份……`;
  socket.addEventListener("open", () => socket.send(JSON.stringify({ type: "auth", accessToken: authSession.access_token })));
  socket.addEventListener("message", (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "room_event" && message.event?.type === "player_joined" && message.event.player?.id === authSession.user?.id) {
        clearTimeout(timeout); systemMessage.textContent = `${label}身份验证成功，房间状态已同步。`; socket.close();
      } else if (message.type === "error" && message.code === "auth_invalid") {
        clearTimeout(timeout); setAuthSession(null); systemMessage.textContent = "登录状态已失效，请重新登录。"; socket.close();
      }
    } catch { /* Ignore malformed frames. */ }
  });
  socket.addEventListener("error", () => { clearTimeout(timeout); systemMessage.textContent = `${label}实时通道连接失败。`; }, { once: true });
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
    const [healthResponse, catalogResponse] = await Promise.all([
      fetch("/api/health", { cache: "no-store" }), fetch("/api/catalog", { cache: "no-store" })
    ]);
    if (!healthResponse.ok) throw new Error("health_failed");
    const health = await healthResponse.json();
    const catalog = catalogResponse.ok ? await catalogResponse.json() : { items: [] };
    networkState.classList.add("is-online"); networkState.lastElementChild.textContent = "边缘在线";
    dbState.textContent = health.dependencies.supabase ? "已连接" : "待配置";
    dbState.className = health.dependencies.supabase ? "mint" : "";
    systemMessage.textContent = `Worker 正常 · 商品目录 ${catalog.items?.length ?? 0} 项 · Stripe ${health.dependencies.stripe ? "已连接" : "待接入"}`;
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
  const label = button.dataset.room === "tutorial" ? "教程轮回" : "无限试炼";
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

updateClock(); setInterval(updateClock, 1000); restoreAuth(); checkWorker();
