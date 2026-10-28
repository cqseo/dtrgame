const byId = (id) => document.getElementById(id);
const networkState = byId("network-state");
const dbState = byId("db-state");
const socketState = byId("socket-state");
const systemMessage = byId("system-message");

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
        if (message.type === "pong") { socketState.textContent = "已连接"; socketState.className = "mint"; }
      } finally { clearTimeout(timeout); socket.close(); resolve(); }
    }, { once: true });
    socket.addEventListener("error", () => { clearTimeout(timeout); socketState.textContent = "异常"; resolve(); }, { once: true });
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
  systemMessage.textContent = `${button.dataset.room === "tutorial" ? "教程轮回" : "无限试炼"}仍处于观测阶段，实时通道检测已启动。`;
  checkSocket();
}));
byId("login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const note = byId("login-note"); note.classList.add("is-error");
  note.textContent = "账号认证尚未开放；本次输入没有发送或保存。";
});

updateClock(); setInterval(updateClock, 1000); checkWorker();
