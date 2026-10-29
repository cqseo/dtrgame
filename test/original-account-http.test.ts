import { describe, it, expect, vi } from 'vitest';
import { legacyCookiePassword, legacyStoredPassword } from '../src/original-auth';
import { originalAccountError, originalLoginHttp, ORIGINAL_COOKIE_PREFIX, type OriginalAccountHttpStore } from '../src/original-account-http';
import { originalInputFilter } from '../src/original-request-input';
import { originalErrorMessages } from '../src/generated/original-account-templates';
const username = 'QA_login';
const rawPassword = 'test\'\\<&"___';
const cookie = legacyCookiePassword(originalInputFilter(rawPassword));
function store() {
  return {
    findByUsername: vi.fn(async (name: string) => name === username ? { username, password: legacyStoredPassword(username, cookie), groupid: 1, roomid: 8 } : null),
    saveLogin: vi.fn(async (_name: string, _now: number, _ip: string) => undefined),
  } satisfies OriginalAccountHttpStore;
}
const request = (cookieHeader = '') => new Request('https://qa.invalid/login.php', {
  method: 'POST', headers: { cookie: cookieHeader, 'cf-connecting-ip': '192.0.2.9' },
});
describe('Source login.php HTTP and state transitions', () => {
  it('filters raw password before hashing, awaits login persistence and sets all three cookies', async () => {
    const db = store();
    const result = await originalLoginHttp(request(), new URLSearchParams({ username, password: rawPassword }), db, { now: () => Date.UTC(2026, 9, 29) });
    expect(result.status).toBe(302);
    expect(result.headers.get('location')).toBe('index.php');
    expect(db.saveLogin).toHaveBeenCalledWith(username, 1793232000, '192.0.2.9');
    const headers = result.headers.getSetCookie();
    expect(headers).toHaveLength(3);
    expect(headers[0]).toContain(ORIGINAL_COOKIE_PREFIX + 'user=' + username);
    expect(headers[1]).toContain(ORIGINAL_COOKIE_PREFIX + 'pass=' + cookie);
    expect(headers[1]).toContain('HttpOnly');
    expect(headers[2]).toBe('acbra2_roomid=0; Path=/; Secure');
    expect(headers.join('\n')).not.toContain(rawPassword);
  });
  it('logout takes precedence, clears user/pass and does not change room or database', async () => {
    const db = store();
    const result = await originalLoginHttp(request(), new URLSearchParams({ mode: 'quit', username, password: 'bad' }), db);
    expect(result.status).toBe(302);
    expect(result.headers.getSetCookie()).toHaveLength(2);
    expect(result.headers.getSetCookie().every(c => c.includes('Max-Age=0'))).toBe(true);
    expect(db.findByUsername).not.toHaveBeenCalled();
    expect(db.saveLogin).not.toHaveBeenCalled();
  });
  it('preserves PHP error-page status and exact error markup, with no state write', async () => {
    const db = store();
    const result = await originalLoginHttp(request(), new URLSearchParams({ username, password: 'bad' }), db);
    expect(result.status).toBe(200);
    expect(await result.text()).toBe(await originalAccountError('wrong_pw').text());
    expect(result.headers.get('set-cookie')).toBeNull();
    expect(db.saveLogin).not.toHaveBeenCalled();
  });
  it('uses the source raw-cookie gate even when the cookie password is invalid', async () => {
    const db = store();
    const result = await originalLoginHttp(request('acbra2_user=QA_login; acbra2_pass=bad'), new URLSearchParams(), db);
    expect(await result.text()).toContain(originalErrorMessages.name_not_set);
    expect(db.findByUsername).not.toHaveBeenCalled();
  });
  it('valid existing cookies do not silently turn an empty login submission into a successful login', async () => {
    const db = store();
    const result = await originalLoginHttp(request('acbra2_user=QA_login; acbra2_pass=' + cookie), new URLSearchParams(), db);
    expect(await result.text()).toContain(originalErrorMessages.name_not_set);
    expect(db.saveLogin).not.toHaveBeenCalled();
  });
  it('applies IP rejection before account lookup and preserves validation precedence', async () => {
    const db = store();
    const result = await originalLoginHttp(request(), new URLSearchParams({ username, password: 'bad' }), db, { bannedIPs: /^192\.0\.2\./ });
    expect(await result.text()).toContain(originalErrorMessages.ip_banned);
    expect(db.findByUsername).not.toHaveBeenCalled();
  });
  it('never issues cookies when persistence fails', async () => {
    const db = store();
    db.saveLogin.mockRejectedValueOnce(new Error('database unavailable'));
    await expect(originalLoginHttp(request(), new URLSearchParams({ username, password: rawPassword }), db)).rejects.toThrow('database unavailable');
  });
});
