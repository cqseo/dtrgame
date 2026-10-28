#!/usr/bin/env node
/**
 * Reject static-only "ACFUN DTS original game" releases.
 * Must pass only with a disposable, authenticated, non-production test account
 * and isolated dedicated test room.
 *
 * No credentials are created here. No actions submitted to the Baota old site.
 */
const origin = process.env.DTS_STAGE_URL;
if (!origin || !/^https:\/\//.test(origin)) {
  console.error("Set DTS_STAGE_URL to the isolated Cloudflare staging origin.");
  process.exit(2);
}
const result = { url: origin, stage: "full-playability", checks: [], pass: false };
const check = (name, pass, detail = "") => result.checks.push({ name, pass, detail });
async function read(path, init) {
  const r = await fetch(new URL(path, origin), init);
  return { status: r.status, text: await r.text() };
}
try {
  const home = await read("/index.php");
  check("original_home", home.status === 200 && home.text.includes("ACFUN 大 逃 杀"), String(home.status));
  const assets = await read("/include/javascript/game.20240318.js");
  check("original_client", assets.status === 200 && assets.text.includes("postCmd("), String(assets.status));
  const login = await read("/login.php");
  check("original_login_form", login.status === 200 && /<form[^>]+name="login"/.test(login.text), String(login.status));
  const stage = await read("/__stage_status");
  if (stage.status === 200) {
    const metadata = JSON.parse(stage.text);
    check("backend_implemented", metadata.backendParity === true, "reported=" + metadata.backendParity);
    check("not_readonly", metadata.readonly === false, "reported=" + metadata.readonly);
    check("not_just_guest_snapshot", !metadata.stage?.includes("reference"), metadata.stage);
  } else {
    check("stage_status_not_public", true, "no metadata endpoint");
  }
  // A safe protocol check with an unknown command: it must not return static HTML.
  // In a finished backend, requests are authenticated before mutations.
  const response = await read("/command.php", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ command: "__legacy_parity_nonexistent_action__" })
  });
  check("command_backend_not_501", response.status !== 501, String(response.status));
  check("no_php_html_for_ajax", !response.text.includes("<!DOCTYPE html"), response.text.slice(0, 100));
  const room = await read("/roomcmd.php", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ command: "__legacy_parity_nonexistent_action__" })
  });
  check("room_backend_not_501", room.status !== 501, String(room.status));
} catch (error) {
  check("runtime_error", false, String(error));
}
result.pass = result.checks.every(x => x.pass);
console.log(JSON.stringify(result, null, 2));
if (!result.pass) process.exitCode = 1;
