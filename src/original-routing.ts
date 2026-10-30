/**
 * The original's edge routing contract.
 *
 * These rules are not a security layer bolted onto the port: they are part of
 * the behaviour the browser sees, and the captured fixtures in
 * test/fixtures/golden record exactly what the original answers. They come
 * from the production nginx configuration of dts.zhangyingyin.top, and the
 * isolated golden-master instance mirrors them verbatim.
 *
 * nginx resolves locations in a fixed order, which this reproduces:
 *   1. exact `=` matches
 *   2. `^~` prefix matches, longest first
 *   3. regular expressions, in configuration order
 *   4. plain prefix matches
 */

/** nginx's own error pages, byte for byte, including CRLF line endings. */
function nginxError(status: number, title: string): Response {
  const body =
    `<html>\r\n<head><title>${title}</title></head>\r\n<body>\r\n` +
    `<center><h1>${title}</h1></center>\r\n<hr><center>nginx</center>\r\n</body>\r\n</html>\r\n`;
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

export const originalForbidden = (): Response => nginxError(403, "403 Forbidden");
export const originalGone = (): Response => nginxError(410, "410 Gone");

/** Served from /include/javascript/ only with these extensions. */
const JAVASCRIPT_DIR_EXTENSIONS = /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$/i;

/** Refused anywhere by the trailing-extension rule. */
const DENIED_EXTENSIONS = /\.(?:sql|bak|log|ini|conf|lock|gz|zip|tar|yml|yaml|md)$/i;

/**
 * `allow 127.0.0.1; deny all;` in the original vhost. The local daemon calls
 * these over loopback; a browser never can, so on Cloudflare — where every
 * request arrives from outside — the faithful equivalent is an unconditional
 * refusal.
 *
 * Do not "correct" this against a captured fixture: the golden instance is
 * reached through a loopback forward, so it answers 200 for these paths. That
 * is the allow rule matching the capture client, not the behaviour the site
 * presents to the public, and these paths are deliberately left out of the
 * captured route set for that reason.
 */
const LOOPBACK_ONLY_SCRIPTS =
  /^\/(modulemng|modulemng_activate|daemonmng|gencode_transformer|tools_users_card_reissue|tools_users_table_alter)\.php$/;

/**
 * Returns the response the original's edge would produce, or null when the
 * request reaches the application.
 */
export function applyOriginalRouting(pathname: string, method: string): Response | null {
  // 1. Exact matches.
  if (pathname === "/install_NEW.php") return originalGone();
  if (pathname === "/command.php") {
    // limit_except POST { deny all; }
    return method === "POST" ? null : originalForbidden();
  }

  // 2. Prefix (^~) matches, longest first.
  if (pathname.startsWith("/gamedata/css/")) {
    return /\.css$/i.test(pathname) ? null : originalForbidden();
  }
  if (pathname.startsWith("/include/javascript/")) {
    return JAVASCRIPT_DIR_EXTENSIONS.test(pathname) ? null : originalForbidden();
  }
  if (pathname.startsWith("/gamedata/")) return originalForbidden();
  if (pathname.startsWith("/include/")) return originalForbidden();
  if (pathname.startsWith("/install/")) return originalForbidden();

  // 3. Regular expressions, in configuration order.
  if (LOOPBACK_ONLY_SCRIPTS.test(pathname)) return originalForbidden();
  if (/\/\./.test(pathname)) return originalForbidden();
  if (DENIED_EXTENSIONS.test(pathname)) return originalForbidden();

  return null;
}
