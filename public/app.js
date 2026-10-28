const status = document.querySelector("#status");
try {
  const response = await fetch("/api/health", { cache: "no-store" });
  const health = await response.json();
  if (!response.ok || !health.ok) throw new Error("health check failed");
  status.textContent = `Worker 正常 · Supabase ${health.dependencies.supabase ? "已连接" : "待配置"} · Stripe ${health.dependencies.stripe ? "已连接" : "待配置"}`;
} catch {
  status.textContent = "Worker 状态检查失败";
  status.classList.add("error");
}
