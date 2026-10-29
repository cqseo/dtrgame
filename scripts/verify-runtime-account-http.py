"""Live isolated Worker acceptance. Credentials stay in a private input file.

This proves account HTTP transitions, not gameplay. Never prints cookie values.
"""
import concurrent.futures
import hashlib
import http.cookiejar
import json
import sys
import urllib.parse
import urllib.request
import urllib.error

BASE = 'https://dtrgame-original-runtime-qa-20261029.dearpassengerscrew-new.workers.dev'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

def call(path, data=None, cookies=None):
    headers = {'Content-Type': 'application/x-www-form-urlencoded'} if data is not None else {}
    headers['User-Agent'] = 'Mozilla/5.0 DTS-Isolated-QA/1.0'
    if cookies: headers['Cookie'] = cookies
    request = urllib.request.Request(BASE + path, data=None if data is None else urllib.parse.urlencode(data).encode(), headers=headers)
    try: response = urllib.request.build_opener(NoRedirect).open(request, timeout=25)
    except urllib.error.HTTPError as error: response = error
    with response:
        return response.status, response.headers, response.read()

def check_account(account):
    username, password = account['username'], account['password']
    code, headers, body = call('/login.php', {'username': username, 'password': password, 'mode': 'main'})
    assert code == 302 and headers['Location'] == 'index.php', f'login returned {code}'
    cookies = headers.get_all('Set-Cookie')
    assert len(cookies) == 3
    assert any(c.startswith('acbra2_user=' + username + ';') for c in cookies)
    assert any(c.startswith('acbra2_pass=') and 'HttpOnly' in c for c in cookies)
    assert any(c.startswith('acbra2_roomid=0;') for c in cookies)
    assert password.encode() not in body
    cookie_header = '; '.join(c.split(';')[0] for c in cookies)
    code, headers, body = call('/login.php', {'username': username, 'password': 'incorrect-password'})
    assert code == 200 and headers.get('Set-Cookie') is None
    assert b'ERROR_2.png' in body
    code, headers, body = call('/game.php', {'mode': 'quit'}, cookie_header)
    assert code == 302 and headers['Location'] == 'index.php'
    assert len(headers.get_all('Set-Cookie')) == 2
    assert all('Max-Age=0' in c for c in headers.get_all('Set-Cookie'))
    return {'login': 'passed', 'wrongPassword': 'passed', 'gameLogout': 'passed', 'cookieContract': 'passed'}

accounts = json.load(open(sys.argv[1]))
code, headers, body = call('/login.php')
assert code == 200 and '用户登录'.encode() in body and b'name="login" action="login.php"' in body
guest_hash = hashlib.sha256(body).hexdigest()
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    results = list(pool.map(check_account, accounts))
assets = {}
for path in ['/gamedata/css/dts-mobile.20261027.css', '/include/javascript/common.20240301.js', '/img/ERROR_2.png']:
    code, headers, body = call(path)
    assets[path] = {'status': code, 'sha256': hashlib.sha256(body).hexdigest(), 'bytes': len(body)}
    assert code == 200 and len(body) > 0
code, _, _ = call('/game.php')
assert code == 501
print(json.dumps({'pass': True, 'scope': 'Live isolated account HTTP only; game not playable',
    'guestLoginHtmlSha256': guest_hash, 'concurrentAccounts': len(results), 'accounts': results,
    'assets': assets, 'gameStatus': code}, ensure_ascii=False))
