import { legacyAuthenticateForm, legacyReadCookiePair, legacyCookieHeaders, type LegacyUserStore } from './original-login';
import { originalFormInput, originalInputFilter } from './original-request-input';
import { originalAccountTemplates, originalAccountDefaults, originalErrorMessages, originalAccountPolicy } from './generated/original-account-templates';
import { phpTruthy, type TemplateContext } from './original-template-runtime';
import { legacyUsernameCheck, legacyPasswordCheck } from './original-auth';

export const ORIGINAL_COOKIE_PREFIX = 'acbra2_';
export interface OriginalAccountHttpStore extends LegacyUserStore {
  saveLogin(username: string, timestamp: number, ip: string): Promise<void>;
}
export interface OriginalAccountHttpOptions {
  now?: () => number;
  bannedNames?: RegExp;
  bannedIPs?: RegExp;
}
// The installed banlist uses [pattern] PCRE delimiters, without flags.
// Empty IP pattern produces no match in the source. Reject unsupported syntax.
function sourceBanPattern(value: string): RegExp | undefined {
  if (value === '') return undefined;
  if (!value.startsWith('[') || !value.endsWith(']') || value.includes('(?')) throw new Error('Ban pattern needs an explicit PCRE port');
  return new RegExp(value.slice(1, -1), 'u');
}
export function originalAccountPage(name: keyof typeof originalAccountTemplates, context: TemplateContext = {}, script = 'login'): Response {
  const body = originalAccountTemplates[name]({ ...originalAccountDefaults, ...context, GLOBALS: { _ERROR: originalErrorMessages } },
    { IN_GAME: true, CURSCRIPT: script }, () => { throw new Error('Account template requires an unstaged asset'); });
  return new Response(body, { headers: {
    'content-type': 'text/html; charset=utf-8', 'cache-control': 'private, no-store, max-age=0', pragma: 'no-cache', expires: '0',
  } });
}
export function originalAccountError(key: string, context: TemplateContext = {}, script = 'login'): Response {
  const message = originalErrorMessages[key];
  if (message === undefined) throw new Error('Unknown source account error');
  // PHP gexit includes error.htm in its own function scope, without the user's
  // local template state or gamecredits. Preserve that observable distinction.
  return originalAccountPage('error', { ...context, gamecredits: '', message }, script);
}
export function originalLogout(secure: boolean): Response {
  const headers = new Headers({ location: 'index.php', 'cache-control': 'private, no-store, max-age=0' });
  for (const key of ['user', 'pass']) headers.append('set-cookie',
    ORIGINAL_COOKIE_PREFIX + key + '=deleted; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0; Path=/' +
    (secure ? '; Secure' : '') + (key === 'pass' ? '; HttpOnly' : ''));
  return new Response(null, { status: 302, headers });
}
export async function originalLoginHttp(request: Request, form: URLSearchParams, store: OriginalAccountHttpStore,
  options: OriginalAccountHttpOptions = {}): Promise<Response> {
  const secure = new URL(request.url).protocol === 'https:';
  const input = originalFormInput(form);
  if (input.get('mode') === 'quit') return originalLogout(secure);
  const rawCookie = request.headers.get('cookie') ?? '';
  const pair = legacyReadCookiePair(rawCookie, ORIGINAL_COOKIE_PREFIX);
  // sys.init copies cookies to cuser/cpass; login.php does not authenticate them
  // before its empty-username branch. Cookie validity belongs to game entry.
  const cuser = pair.username === null ? null : originalInputFilter(pair.username);
  if (!input.has('username') && !phpTruthy(cuser)) return originalAccountPage('login_page', cuser === null ? {} : { cuser });
  const bannedNames = options.bannedNames ?? sourceBanPattern(originalAccountPolicy.names);
  const nameCheck = legacyUsernameCheck(input.get('username'), bannedNames);
  if (nameCheck !== 'name_ok') return originalAccountError(nameCheck);
  const passCheck = legacyPasswordCheck(input.get('password'), input.get('password'));
  if (passCheck !== 'pass_ok') return originalAccountError(passCheck);
  // Cloudflare supplies the verified client address; never trust client XFF.
  const ip = request.headers.get('cf-connecting-ip') ?? '';
  if ((options.bannedIPs ?? sourceBanPattern(originalAccountPolicy.ips))?.test(ip)) return originalAccountError('ip_banned');
  const login = await legacyAuthenticateForm(input, store, bannedNames);
  if (!login.ok) return originalAccountError(login.error);
  const now = (options.now ?? Date.now)();
  await store.saveLogin(login.username, Math.floor(now / 1000), ip);
  const headers = new Headers({ location: 'index.php', 'cache-control': 'private, no-store, max-age=0' });
  for (const value of legacyCookieHeaders(login.username, login.cookiePassword, ORIGINAL_COOKIE_PREFIX, secure, now)) headers.append('set-cookie', value);
  // Source set_current_roomid changes a session cookie, not users.roomid.
  headers.append('set-cookie', ORIGINAL_COOKIE_PREFIX + 'roomid=0; Path=/' + (secure ? '; Secure' : ''));
  return new Response(null, { status: 302, headers });
}
