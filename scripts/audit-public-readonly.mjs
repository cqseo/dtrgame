#!/usr/bin/env node
/**
 * DTS public, read-only smoke audit.
 * Never sends credentials, changes payments, or writes game state.
 *
 * Usage: node scripts/audit-public-readonly.mjs
 * Environment: DTS_BASE and DTS_STAGE_BASE can override default URLs.
 */
const production = new URL(process.env.DTS_BASE || 'https://dts.zhangyingyin.top/');
const staging = new URL(process.env.DTS_STAGE_BASE ||
  'https://dtrgame-original-1to1-staging.dearpassengerscrew-new.workers.dev/');
const tests = [
  { label: 'home', path: '/', expect: /(?:終局戰場|ACFUN|大逃殺|登入|登錄|登录)/ },
  { label: 'help topic', path: '/help.php?topic=movement', expect: /(?:移動|行動|移动)/ },
  { label: 'probability disclosure', path: '/draw-odds.php', expect: /(?:抽卡|機率|概率|保底)/ },
  { label: 'recharge entry', path: '/recharge.php', expect: /(?:充值|切糕|登入|登錄|登录)/ }
];
function simpleText(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 250000);
}
async function request(url) {
  const r = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { Accept: 'text/html,application/json', 'User-Agent': 'DTS-ReadOnly-QA/1.0' },
    signal: AbortSignal.timeout(18000)
  });
  return { status: r.status, url: r.url, body: await r.text() };
}
const findings = [];
for (const test of tests) {
  const url = new URL(test.path, production).toString();
  try {
    const result = await request(url);
    const match = test.expect.test(simpleText(result.body));
    const ok = result.status === 200 && match;
    findings.push({
      target: 'production', check: test.label, url,
      status: result.status, result: ok ? 'PASS' : 'REVIEW',
      note: match ? '' : 'Expected visible content was not found; inspect manually.'
    });
  } catch (error) {
    findings.push({ target: 'production', check: test.label, url, result: 'ERROR', note: String(error) });
  }
}
const stageStatusUrl = new URL('/__stage_status', staging).toString();
try {
  const result = await request(stageStatusUrl);
  const state = JSON.parse(result.body);
  findings.push({
    target: 'cloudflare-staging', check: 'no fake production release', url: stageStatusUrl,
    status: result.status,
    result: result.status === 200 && state.playable === false && state.backendParity === false ? 'PASS' : 'REVIEW',
    note: 'A PASS here confirms only an honest staging label, not playable 1:1 parity.',
    reported: {
      playable: state.playable,
      backendParity: state.backendParity,
      legacyModuleScope: state.legacyModuleScope,
      roomLifecycle: state.roomLifecycle,
      matchLifecycle: state.matchLifecycle
    }
  });
} catch (error) {
  findings.push({target:'cloudflare-staging',check:'no fake production release',url:stageStatusUrl,
    result:'ERROR',note:String(error)});
}
const report = {
  generatedAt: new Date().toISOString(),
  limitations: [
    'Unauthenticated GET only, not browser/visual QA.',
    'Does not verify player sessions, combat, cross-device state, Stripe, copyright, or payment.',
    'A successful public page response never authorizes the Cloudflare 1:1 switchover.'
  ],
  findings
};
console.log(JSON.stringify(report, null, 2));
if (findings.some(x => x.result !== 'PASS')) process.exitCode = 1;
