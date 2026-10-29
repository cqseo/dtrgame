import { Client } from 'pg';
import { OriginalRuntimeUsers } from './original-runtime-users';
import { originalAccountError, originalAccountPage, originalLoginHttp, originalLogout } from './original-account-http';
import {originalRoomHttp} from './original-room-http';
import {legacyAuthenticateCookies,legacyReadCookiePair} from './original-login';
import {originalInputFilter} from './original-request-input';

const staticPath = /^\/(?:img\/|gamedata\/css\/|include\/javascript\/|favicon\.ico$|apple-touch-icon\.png$|site\.webmanifest$)/;
async function formInput(request: Request): Promise<URLSearchParams> {
  const form = new URL(request.url).searchParams;
  if (request.method !== 'POST') return form;
  if (!(request.headers.get('content-type') ?? '').startsWith('application/x-www-form-urlencoded')) throw new RangeError('Unsupported form');
  const reader = request.body?.getReader();
  if (!reader) return form;
  let length = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    length += next.value.byteLength;
    if (length > 16384) { await reader.cancel(); throw new RangeError('Form too large'); }
    chunks.push(next.value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  for (const [key, value] of new URLSearchParams(new TextDecoder().decode(bytes))) form.set(key, value);
  return form;
}
export default {
  async fetch(request: Request, env: RuntimeQAEnv): Promise<Response> {
    if (env.APP_ENV !== 'isolated-qa') return new Response('Invalid QA environment', { status: 503 });
    const url = new URL(request.url);
    if (url.pathname === '/__stage_status') return Response.json({ backend: 'TypeScript', database: 'isolated Supabase copy',
      login: true, waitingRooms: true, playable: false, originProxy: false, missing: ['game initialization', 'command pipeline', 'all module effects', 'game templates', 'settlement'] });
    if ((request.method === 'GET' || request.method === 'HEAD') && staticPath.test(url.pathname)) return env.ORIGINAL_ASSETS.fetch(request);
    if (!['GET', 'HEAD', 'POST'].includes(request.method)) return new Response(null, { status: 405, headers: { allow: 'GET, HEAD, POST' } });
    if (!['/','/index.php','/roomcmd.php','/roomupdate.php','/error.php','/login.php', '/game.php'].includes(url.pathname)) return new Response('Original route not yet ported.', { status: 501, headers: { 'cache-control': 'no-store' } });
    let form: URLSearchParams;
    try { form = await formInput(request); } catch { return new Response(null, { status: 400 }); }
    if(url.pathname==='/error.php')return originalAccountPage('error',{message:originalInputFilter(form.get('errormsg')??''),gamecredits:''},'error');
    if (form.get('mode') === 'quit' && (url.pathname === '/login.php' || request.method === 'POST')) return originalLogout(url.protocol === 'https:');
    if (url.pathname === '/game.php') {
      // The actual game chain is incomplete. Do not pass authenticated users
      // to a static guest snapshot and pretend the game has started.
      return new Response('Original game command chain is not yet ported.', { status: 501, headers: { 'cache-control': 'no-store' } });
    }
    if (url.pathname==='/login.php' && !form.has('username') && !request.headers.get('cookie')) {
      const page = originalAccountPage('login_page');
      return request.method === 'HEAD' ? new Response(null, page) : page;
    }
    const client = new Client({ connectionString: env.QA_DATABASE.connectionString, connectionTimeoutMillis: 10000 });
    try {
      await client.connect();
      const store = new OriginalRuntimeUsers({ query: async (sql, params) => client.query(sql, [...params]) });
      let result:Response;
      if(url.pathname==='/login.php')result=await originalLoginHttp(request, form, store);
      else{
        const pair=legacyReadCookiePair(request.headers.get('cookie')??'','acbra2_');
        const cookie=pair.username&&pair.cookiePassword?'acbra2_user='+encodeURIComponent(originalInputFilter(pair.username))+'; acbra2_pass='+encodeURIComponent(originalInputFilter(pair.cookiePassword)):'';
        const user=await legacyAuthenticateCookies(cookie,store,'acbra2_');
        result=await originalRoomHttp(request,form,{query:async(sql,params)=>client.query(sql,[...params])},user);
      }
      return request.method === 'HEAD' ? new Response(null, result) : result;
    } catch {
      // Never expose database exception text, SQL, credentials or input.
      const page = originalAccountError('db_failure');
      return new Response(request.method === 'HEAD' ? null : page.body, { status: 503, headers: page.headers });
    } finally { await client.end().catch(() => undefined); }
  }
} satisfies ExportedHandler<RuntimeQAEnv>;
