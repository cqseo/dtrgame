#!/usr/bin/env node
/**
 * ACFUN DTS immutable asset parity gate.
 * Strictly READ-ONLY; no PHP gameplay actions, credentials, or player DB access.
 * Can compare the captured original files to local port assets or to a Worker URL.
 *
 * node scripts/original-asset-parity.mjs \
 *   --manifest /opt/dts-sandbox/backups/legacy-ui-reference-20261028/full-ui-manifest.json \
 *   --baseline-root /www/wwwroot/dts-game-test \
 *   --candidate-url https://dtrgame-original-1to1-staging.example.workers.dev
 *
 * --candidate-root may be used instead of --candidate-url for fully offline tests.
 */
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, sep, isAbsolute } from 'node:path';

function usage(message) {
  if (message) console.error(message);
  console.error('Usage: node scripts/original-asset-parity.mjs --manifest FILE --baseline-root DIR (--candidate-root DIR | --candidate-url HTTPS_URL) [--limit N]');
  process.exit(2);
}
function flags(argv) {
  const opts = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i], value = argv[i + 1];
    if (!key?.startsWith('--') || !value || value.startsWith('--')) usage('Expected value after ' + key);
    if (Object.hasOwn(opts, key)) usage('Duplicate option: ' + key);
    opts[key] = value;
  }
  if (!opts['--manifest'] || !opts['--baseline-root']) usage();
  if (!!opts['--candidate-root'] === !!opts['--candidate-url']) usage('Supply exactly one candidate source');
  if (opts['--candidate-url']) {
    const url = new URL(opts['--candidate-url']);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash) usage('Candidate must be an HTTPS origin without credentials or query');
    opts.url = url;
  }
  const limit = opts['--limit'] === undefined ? 6 : Number(opts['--limit']);
  if (!Number.isInteger(limit) || limit < 1 || limit > 16) usage('Limit must be 1–16');
  opts.limit = limit;
  return opts;
}
function safeName(filename) {
  const name = String(filename).replaceAll('\\', '/').replace(/^\.\//, '').replace(/^\/+/, '');
  const segments = name.split('/');
  if (!name || name.includes('\0') || name.includes('?') || name.includes('#') || segments.some(s => !s || s === '.' || s === '..')) {
    throw new Error('Unsafe manifest filename: ' + filename);
  }
  return name;
}
function within(root, name) {
  const base = resolve(root);
  const file = resolve(base, ...name.split('/'));
  const rel = relative(base, file);
  if (rel === '..' || rel.startsWith('..' + sep) || isAbsolute(rel)) throw new Error('Path escapes root: ' + name);
  return file;
}
function sha256(buffer) { return createHash('sha256').update(buffer).digest('hex'); }
function normalizeEntry(entry, key) {
  if (typeof entry === 'string') {
    if (key === undefined) return { path: safeName(entry), sha256: null, size: null };
    return { path: safeName(key), sha256: entry, size: null };
  }
  if (!entry || typeof entry !== 'object') throw new Error('Unsupported manifest entry');
  const path = safeName(entry.path ?? entry.file ?? entry.name ?? key);
  const expectedHash = entry.sha256 ?? entry.sha_256 ?? entry.hash ?? entry.digest ?? null;
  const expectedSize = entry.size ?? entry.length ?? entry.bytes ?? null;
  const sha = typeof expectedHash === 'string' ? expectedHash.replace(/^sha256:/i, '').toLowerCase() : null;
  if (sha && !/^[a-f0-9]{64}$/.test(sha)) throw new Error('Bad SHA-256 entry: ' + path);
  if (expectedSize !== null && (!Number.isInteger(Number(expectedSize)) || Number(expectedSize) < 0)) throw new Error('Bad size entry: ' + path);
  return { path, sha256: sha, size: expectedSize === null ? null : Number(expectedSize) };
}
function entriesFromManifest(value) {
  // Supports common snapshot manifest forms without presuming the Baota snapshot's exact JSON shape.
  let contents = value;
  if (!Array.isArray(contents)) {
    contents = value?.files ?? value?.entries ?? value?.manifest ?? value?.assets;
    if (!contents) {
      if (!value || typeof value !== 'object') throw new Error('Unsupported manifest format');
      contents = value;
    }
  }
  const entries = Array.isArray(contents)
    ? contents.map(v => normalizeEntry(v))
    : Object.entries(contents).map(([name, value]) => normalizeEntry(value, name));
  if (!entries.length) throw new Error('Empty manifest');
  const unique = new Set();
  for (const entry of entries) {
    if (unique.has(entry.path)) throw new Error('Duplicate manifest path: ' + entry.path);
    unique.add(entry.path);
  }
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}
async function getCandidate(path, opts) {
  if (opts['--candidate-root']) return readFile(within(opts['--candidate-root'], path));
  const target = new URL(opts.url);
  const basePath = target.pathname.endsWith('/') ? target.pathname : target.pathname + '/';
  target.pathname = basePath + path.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(target, {
    method: 'GET', redirect: 'manual', headers: { 'accept-encoding': 'identity' },
    signal: AbortSignal.timeout(15000)
  });
  if (response.status !== 200) throw new Error('HTTP ' + response.status + (response.headers.get('location') ? ' redirect' : ''));
  return Buffer.from(await response.arrayBuffer());
}
async function verify(entry, opts) {
  const result = { path: entry.path, ok: false, error: null };
  try {
    const original = await readFile(within(opts['--baseline-root'], entry.path));
    const oldHash = sha256(original);
    if (entry.sha256 && oldHash !== entry.sha256) throw new Error('BASELINE_HASH_MISMATCH');
    if (entry.size !== null && original.length !== entry.size) throw new Error('BASELINE_LENGTH_MISMATCH');
    const candidate = await getCandidate(entry.path, opts);
    if (oldHash !== sha256(candidate)) throw new Error('CANDIDATE_HASH_MISMATCH');
    if (original.length !== candidate.length) throw new Error('CANDIDATE_LENGTH_MISMATCH');
    result.ok = true;
  } catch (error) { result.error = String(error.message ?? error); }
  return result;
}
async function main() {
  const opts = flags(process.argv.slice(2));
  const manifest = JSON.parse(await readFile(opts['--manifest'], 'utf8'));
  const entries = entriesFromManifest(manifest);
  let cursor = 0;
  const results = [];
  async function worker() {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      results.push(await verify(entry, opts));
    }
  }
  await Promise.all(Array.from({ length: Math.min(entries.length, opts.limit) }, () => worker()));
  const failures = results.filter(r => !r.ok).sort((a, b) => a.path.localeCompare(b.path));
  const report = {
    test: 'ACFUN DTS byte-for-byte immutable asset parity',
    readOnly: true,
    baselineCount: entries.length,
    passed: results.length - failures.length,
    failed: failures.length,
    pass: failures.length === 0,
    failures: failures.slice(0, 50),
    truncatedFailureCount: Math.max(0, failures.length - 50),
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === new URL('file://' + resolve(process.argv[1])).href) {
  main().catch(e => { console.error(String(e.message ?? e)); process.exitCode = 2; });
}
export { entriesFromManifest, safeName, sha256, verify };
