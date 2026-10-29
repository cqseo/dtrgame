/**
 * The installed ACFUN DTS register.php AJAX POST logic, ported without changing
 * original error strings, game values, or the legacy client wire protocol.
 *
 * This is a logic adapter only. It deliberately does not serve GET /register.php
 * until the original template engine and all associated account fields are ported.
 * Never bind a production player database to an unaccepted migration stage.
 */
import { legacyCookiePassword, legacyStoredPassword, legacyUsernameCheck, legacyPasswordCheck } from "./original-auth";
import { legacyEncode } from "./original-protocol";
import {
  legacyRegisterFatenumCreate, legacyRegisterVerificationQuestionGet,
  type LegacyRegistrationContext
} from "./original-verification";
import { LEGACY_VQ_POOL } from "./generated/legacy-vq-pool";

export interface LegacyRegistrationAccount {
  username: string;
  password: string; // legacy stored hash, never raw password
  alt_pswd: number;
  groupid: number;
  ip: string;
  credits: number;
  gold: number;
  gender: string;
  icon: string;
  motto: string;
  killmsg: string;
  lastword: string;
  card_data: string;
}

export interface LegacyRegistrationStore {
  exists(username: string): Promise<boolean>;
  /** Insert must be atomic and reject duplicates; never upsert an existing account. */
  insert(record: LegacyRegistrationAccount): Promise<boolean>;
}

export interface LegacyRegistrationEnvironment {
  clock: LegacyRegistrationContext;
  sourceIp: string;
  cookiePrefix: string;
  cookiePath: string;
  cookieDomain?: string;
  secureCookies: boolean;
  bannedNames: RegExp | null;   // original gamedata/banlist.list $nmlimit
  bannedIp: RegExp | null;      // original $iplimit; empty pattern means disabled
  authenticated: boolean;      // caller must validate both original cookies first
}

export type LegacyRegistrationPayload = {
  value: { register_token: string };
  innerHTML: {
    info: string;
    vq_question: string;
    [key: string]: string;
  };
};

export type LegacyRegistrationOutcome =
  | { kind: "already-logged-in"; legacyError: string }
  | { kind: "ajax"; payload: LegacyRegistrationPayload; cookies: string[]; created: boolean };

export const LEGACY_REGISTER_STRINGS = {
  reg_success: "注册成功！请返回首页登陆游戏。",
  db_failure: "数据库读写异常，请重试或通知管理员",
  name_not_set: "用户名不能为空，请检查用户名输入",
  name_too_long: "用户名过长，请检查用户名输入",
  name_invalid: "用户名含有非法字符，请检查用户名输入",
  name_banned: "用户名含有违禁用语，请检查用户名输入",
  name_exists: "用户名已被注册，请更换用户名",
  pass_not_set: "密码不能为空，请检查密码输入",
  pass_not_match: "两次输入的密码不一致，请检查密码输入",
  pass_too_short: "密码过短，请检查密码输入",
  pass_too_long: "密码过长，请检查密码输入",
  ip_banned: "此IP已被封禁，请与管理员联系",
  logged_in: "用户已登录，请先退出登陆再注册",
  vq_answer_retry: "注册验证问题失效，请刷新页面重试",
  vq_answer_wrong: "注册验证问题错误，请重新回答",
} as const;

/**
 * Exact installed include/global.func.php:gstrfilter for string form values.
 * PHP ENT_COMPAT escapes double quotes, but not apostrophes; the apostrophe
 * has already been removed by this function. Double escaping is intentional.
 */
export function legacyInputFilter(value: string): string {
  return value
    .replaceAll("'", "")
    .replaceAll("\\", "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("___", "");
}

function originalInt(value: string | null): number {
  if (value === null) return -1;
  const match = /^[\t\n\r ]*([+-]?\d+)/.exec(value);
  return match ? Number.parseInt(match[1]!, 10) : 0; // PHP (int)$vq_answer
}

function legacyRegistrationCookie(name: "user" | "pass", value: string, env: LegacyRegistrationEnvironment): string {
  // The original register.php uses gsetcookie with life=0 (session cookie).
  // It sets HttpOnly on pass only. Do not silently introduce 15-day expiry.
  const parts = [env.cookiePrefix + name + "=" + encodeURIComponent(value), "Path=" + env.cookiePath];
  if (env.cookieDomain) parts.push("Domain=" + env.cookieDomain);
  if (env.secureCookies) parts.push("Secure");
  if (name === "pass") parts.push("HttpOnly");
  return parts.join("; ");
}

function refreshQuestion(env: LegacyRegistrationEnvironment) {
  const token = legacyRegisterFatenumCreate("", env.clock);
  return { token, challenge: legacyRegisterVerificationQuestionGet(token, LEGACY_VQ_POOL, env.clock) };
}

/**
 * Mirrors register.php's validation precedence and the AJAX DOM update keys.
 * Callers must enforce application/x-www-form-urlencoded, request size limits,
 * trusted IP derivation, and the original logged-in error template separately.
 */
export async function legacyRegisterPost(
  form: URLSearchParams,
  env: LegacyRegistrationEnvironment,
  store: LegacyRegistrationStore,
): Promise<LegacyRegistrationOutcome> {
  if (env.authenticated) return { kind: "already-logged-in", legacyError: LEGACY_REGISTER_STRINGS.logged_in };

  const get = (name: string): string => legacyInputFilter(form.get(name) ?? "");
  const username = get("username");
  const rawPassword = get("npass");
  const repeatedPassword = get("rnpass");
  const submittedToken = get("register_token");
  const answer = originalInt(form.get("vq_answer"));
  const checkName = legacyUsernameCheck(username, env.bannedNames ?? undefined);
  const checkPassword = legacyPasswordCheck(rawPassword, repeatedPassword);

  // PHP evaluates the old token challenge before checking if the token is empty.
  const expected = legacyRegisterVerificationQuestionGet(submittedToken, LEGACY_VQ_POOL, env.clock);
  const cookies: string[] = [];
  let info: string = "";
  let created = false;
  if (checkName !== "name_ok") {
    info = LEGACY_REGISTER_STRINGS[checkName];
  } else if (checkPassword !== "pass_ok") {
    info = LEGACY_REGISTER_STRINGS[checkPassword];
  } else if (env.bannedIp?.test(env.sourceIp)) {
    info = LEGACY_REGISTER_STRINGS.ip_banned;
  } else if (!submittedToken || submittedToken === "0") {
    info = LEGACY_REGISTER_STRINGS.vq_answer_retry;
  } else if (answer !== expected.correct_i) {
    info = LEGACY_REGISTER_STRINGS.vq_answer_wrong;
  } else if (await store.exists(username)) {
    info = LEGACY_REGISTER_STRINGS.name_exists;
  } else {
    const cookiePassword = legacyCookiePassword(rawPassword);
    const record: LegacyRegistrationAccount = {
      username,
      password: legacyStoredPassword(username, cookiePassword),
      alt_pswd: 1,
      groupid: 1,
      ip: env.sourceIp,
      credits: 0,
      gold: 100,
      gender: get("gender"),
      icon: get("icon"),
      motto: get("motto"),
      killmsg: get("killmsg"),
      lastword: get("lastword"),
      card_data: await legacyEncode([{ cardid: 0, cardenergy: 0 }]),
    };
    try {
      created = await store.insert(record);
    } catch {
      // PHP returns the standard database error; avoid leaking DB internals.
      created = false;
    }
    if (created) {
      info = LEGACY_REGISTER_STRINGS.reg_success;
      cookies.push(legacyRegistrationCookie("user", username, env));
      cookies.push(legacyRegistrationCookie("pass", cookiePassword, env));
    } else {
      info = LEGACY_REGISTER_STRINGS.db_failure;
    }
  }

  // The old register.php refreshes the captcha even after registration succeeds.
  const next = refreshQuestion(env);
  const payload: LegacyRegistrationPayload = {
    value: { register_token: next.token },
    innerHTML: { info, vq_question: next.challenge.question },
  };
  for (let index = 0; index < next.challenge.answers.length; index++) {
    payload.innerHTML["vq_answer_disp" + index] = next.challenge.answers[index]!;
  }
  if (created) {
    payload.innerHTML.postreg = '<input type="button" class="b_button bc_white" value="返回游戏首页" onclick="window.location.href=\'index.php\'">';
  }
  return { kind: "ajax", payload, cookies, created };
}

/**
 * Reuse the browser's old JXG.decompress and showData without changing JS.
 * Session cookie creation is deliberately identical to PHP register.php.
 */
export async function legacyRegisterAjaxResponse(outcome: LegacyRegistrationOutcome): Promise<Response> {
  if (outcome.kind !== "ajax") {
    // The separate original error.php template is not ported yet. Fail closed.
    return new Response("Original logged-in registration error template not ported", { status: 501 });
  }
  const headers = new Headers({
    "content-type": "text/plain;charset=utf-8",
    "cache-control": "private, no-store",
  });
  for (const cookie of outcome.cookies) headers.append("set-cookie", cookie);
  return new Response(await legacyEncode(outcome.payload), { status: 200, headers });
}
