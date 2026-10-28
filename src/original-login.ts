/**
 * Original ACFUN DTS login/session compatibility, independent of any database.
 *
 * Source contract: live customized include/user.func.php and login.php.
 * This is a repository-bound adapter. It MUST NOT be exposed as a working
 * login endpoint before real legacy user records are safely migrated.
 */
import {
  legacyCookiePassword, legacyPasswordMatches,
  legacyUsernameCheck, legacyPasswordCheck
} from "./original-auth";

export interface LegacyAccountRow {
  username: string;
  password: string;
  groupid: number;
  roomid: number;
}
export interface LegacyUserStore {
  findByUsername(username: string): Promise<LegacyAccountRow | null>;
  recordLastLogin?(username: string, timestamp: number): Promise<void>;
}
export type LegacyLoginFailure =
  "name_not_set" | "name_too_long" | "name_invalid" | "name_banned" |
  "pass_not_set" | "pass_not_match" | "pass_too_long" |
  "user_not_exists" | "user_ban" | "wrong_pw";
export type LegacyLoginResult =
  | { ok: true; username: string; cookiePassword: string }
  | { ok: false; error: LegacyLoginFailure };

/** Equivalent to old PHP login.php's name_check → pass_check → account lookup. */
export async function legacyAuthenticateForm(
  body: URLSearchParams,
  store: LegacyUserStore,
  bannedNames?: RegExp
): Promise<LegacyLoginResult> {
  const username = body.get("username") ?? "";
  const rawPassword = body.get("password") ?? "";
  const name = legacyUsernameCheck(username, bannedNames);
  if (name !== "name_ok") return { ok: false, error: name };
  const pass = legacyPasswordCheck(rawPassword, rawPassword);
  if (pass !== "pass_ok") return { ok: false, error: pass };
  const row = await store.findByUsername(username);
  if (!row) return { ok: false, error: "user_not_exists" };
  if (row.groupid <= 0) return { ok: false, error: "user_ban" };
  const cookiePassword = legacyCookiePassword(rawPassword);
  if (!legacyPasswordMatches(row.username, cookiePassword, row.password)) {
    return { ok: false, error: "wrong_pw" };
  }
  return { ok: true, username: row.username, cookiePassword };
}
/** Decode cookie pair using PHP's prefix convention; never expose pass in logs. */
export function legacyReadCookiePair(header: string, tablePrefix: string): {
  username: string | null;
  cookiePassword: string | null;
} {
  const values = new Map<string, string>();
  for (const part of header.split(";")) {
    const equal = part.indexOf("=");
    if (equal < 1) continue;
    const name = part.slice(0, equal).trim();
    const encoded = part.slice(equal + 1).trim();
    try { values.set(name, decodeURIComponent(encoded)); } catch { continue; }
  }
  return {
    username: values.get(tablePrefix + "user") ?? null,
    cookiePassword: values.get(tablePrefix + "pass") ?? null
  };
}
export async function legacyAuthenticateCookies(
  cookieHeader: string,
  store: LegacyUserStore,
  tablePrefix: string
): Promise<LegacyAccountRow | null> {
  const { username, cookiePassword } = legacyReadCookiePair(cookieHeader, tablePrefix);
  if (!username || !cookiePassword || !/^[a-f0-9]{32}$/.test(cookiePassword)) return null;
  const row = await store.findByUsername(username);
  if (!row || row.groupid <= 0) return null;
  if (!legacyPasswordMatches(row.username, cookiePassword, row.password)) return null;
  return row;
}
/** Original login.php uses a 15-day expiry; 'pass' is HttpOnly. */
export function legacyCookieHeaders(
  username: string,
  cookiePassword: string,
  tablePrefix: string,
  secure: boolean,
  nowMs = Date.now()
): [string, string] {
  const expires = new Date(nowMs + 15 * 86400 * 1000).toUTCString();
  const common = "; Path=/; Expires=" + expires + (secure ? "; Secure" : "");
  const user = tablePrefix + "user=" + encodeURIComponent(username) + common;
  const pass = tablePrefix + "pass=" + encodeURIComponent(cookiePassword) + common + "; HttpOnly";
  return [user, pass];
}
