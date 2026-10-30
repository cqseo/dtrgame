/**
 * The original's public surface, shared by the capture driver and the parity
 * test so both always describe the same contract.
 *
 * Paths and expected statuses come from the production nginx configuration of
 * dts.zhangyingyin.top, which the isolated instance mirrors exactly.
 *
 * Capture caveat: the instance is reached through a loopback port-forward, so
 * any rule conditioned on the client address answers as it would for
 * 127.0.0.1. The maintenance scripts guarded by `allow 127.0.0.1; deny all;`
 * (modulemng, daemonmng and friends) therefore return 200 here while a browser
 * gets 403, so they are deliberately not captured. Their public behaviour is
 * asserted directly in test/original-routing.test.ts instead.
 */

/** Logged-out pages the browser can reach directly. */
const PAGES = [
  "index.php",
  "login.php",
  "register.php",
  "game.php",
  "help.php",
  "rank.php",
  "map.php",
  "itemhelp.php",
  "cardbook.php",
  "kujilist.php",
  "chat.php",
  "end.php",
  "donate.php"
];

/** The unmodified client the original ships; the port must keep serving it. */
const CLIENT_ASSETS = [
  "include/javascript/game.20240318.js",
  "include/javascript/common.20240301.js"
];

/**
 * Status codes the production vhost enforces. A port that serves these paths
 * as anything else has changed the site's contract even if pages still render.
 */
const CONTRACT = [
  { name: "deny-gamedata-modules", path: "/gamedata/modules.list.php", expectStatus: 403 },
  { name: "deny-include-common", path: "/include/common.inc.php", expectStatus: 403 },
  { name: "deny-install-dir", path: "/install/", expectStatus: 403 },
  { name: "gone-install-new", path: "/install_NEW.php", expectStatus: 410 },
  { name: "command-get-denied", path: "/command.php", expectStatus: 403 },
  { name: "roomcmd-get", path: "/roomcmd.php" },
  { name: "roomupdate-get", path: "/roomupdate.php" }
];

export const GOLDEN_ROUTES = [
  ...PAGES.map(page => ({ name: `page-${page.replace(/\.php$/, "")}`, path: `/${page}`, expectStatus: 200 })),
  ...CLIENT_ASSETS.map(asset => ({
    name: `asset-${asset.split("/").pop().replace(/\./g, "-")}`,
    path: `/${asset}`,
    expectStatus: 200
  })),
  ...CONTRACT,
  { name: "command-post-empty", path: "/command.php", method: "POST", body: {} }
];

/**
 * Removes only what cannot be reproduced run to run, so a diff means a real
 * behavioural difference. Everything else, including every Chinese label and
 * every element id, is compared verbatim.
 */
export function normalizeGoldenBody(body) {
  return body
    // Per-request anti-forgery token.
    .replace(/(name=["']formhash["'][^>]*value=["'])[0-9a-f]+/gi, "$1<FORMHASH>")
    .replace(/formhash=[0-9a-f]+/gi, "formhash=<FORMHASH>")
    // Cache-busting and timing values the original stamps per request.
    .replace(/\b\d{10}\b/g, "<EPOCH>")
    .replace(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/g, "<DATETIME>")
    // Session identifiers echoed into markup.
    .replace(/(sid=)[0-9a-zA-Z]{6,}/g, "$1<SID>");
}
