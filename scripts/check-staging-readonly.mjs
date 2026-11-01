#!/usr/bin/env node
/**
 * Read-only staging HTTP acceptance probes.
 * Only the fixed, isolated Cloudflare Workers preview host is permitted.
 * No registration, login, room actions or game writes are performed here.
 */
const base = "https://dtrgame-original-1to1-staging.dearpassengerscrew-new.workers.dev";
const cases = [
  ["/", 200, body => body.includes("ACFUN 大 逃 杀")],
  ["/index.php", 200, body => body.includes("ACFUN 大 逃 杀")],
  ["/register.php", 200, body => body.includes("register_token") && body.includes("post_register")],
  ["/help.php", 200, body => body.includes("地图中共有35个区域") && body.includes("以下是所有可能被召唤出的佣兵的列表") && body.includes('img/n_150.gif')],
  ["/map.php", 200, body => body.includes('id="map_display"') && (body.match(/mapspan(?:lime|yellow|red)/g) ?? []).length >= 34],
  ["/rank.php", 200, body => body.includes("ACFUN 大 逃 杀")],
  ["/itemhelp.php", 200, body => body.includes("ACFUN 大 逃 杀")],
  ["/game.php", 200, body => body.includes("用户未登陆")],
  ["/roomcmd.php", 200, body => body.includes("你不在房间内")],
  ["/install_NEW.php", 410, () => true],
  ["/command.php", 403, () => true]
];
let failures = 0;
for (const [path, expectedStatus, inspect] of cases) {
  try {
    const response = await fetch(base + path, {
      method: "GET",
      redirect: "manual",
      headers: { "user-agent": "dtr-staging-readonly-smoke/1.0" },
      signal: AbortSignal.timeout(35000)
    });
    const body = await response.text();
    const passed = response.status === expectedStatus && inspect(body);
    if (!passed) failures++;
    console.log(`${passed ? "PASS" : "FAIL"} ${path.padEnd(21)} HTTP ${response.status}, ${Buffer.byteLength(body)} bytes`);
  } catch (error) {
    failures++;
    console.log(`FAIL ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}
try {
  const response = await fetch(base + "/__stage_status", { signal: AbortSignal.timeout(35000) });
  const state = await response.json();
  const passed = response.status === 200 &&
    state.backendParity === false && state.playable === false;
  if (!passed) failures++;
  console.log(`${passed ? "PASS" : "FAIL"} /__stage_status       explicit not-ready flags`);
} catch (error) {
  failures++;
  console.log(`FAIL /__stage_status: ${error instanceof Error ? error.message : String(error)}`);
}
console.log(`Staging read-only acceptance: ${cases.length + 1 - failures}/${cases.length + 1} passed.`);
if (failures) process.exitCode = 1;
