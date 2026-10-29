import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { entriesFromManifest, safeName, sha256, verify } from '../scripts/original-asset-parity.mjs';

test('supports content-hash manifest, validates uniqueness, never accepts traversal', () => {
  const hash = sha256(Buffer.from('hello'));
  assert.deepEqual(entriesFromManifest({ files: { 'img/a.png': { sha256: hash, size: 5 } } }), [{ path: 'img/a.png', sha256: hash, size: 5 }]);
  assert.deepEqual(entriesFromManifest(['include/a.js']), [{ path: 'include/a.js', sha256: null, size: null }]);
  assert.throws(() => safeName('../secret'), /Unsafe/);
  assert.throws(() => entriesFromManifest({ files: ['a', 'a'] }), /Duplicate/);
});

test('compares actual bytes, rejects candidate alterations and baseline drift', async () => {
  const tmp = await mkdtemp(join(tmpdir(), 'dts-parity-'));
  const before = join(tmp, 'before'), after = join(tmp, 'after');
  try {
    await mkdir(join(before, 'img'), { recursive: true });
    await mkdir(join(after, 'img'), { recursive: true });
    await writeFile(join(before, 'img', 'a.gif'), Buffer.from([0x47, 0x49, 0x46, 0]));
    await writeFile(join(after, 'img', 'a.gif'), Buffer.from([0x47, 0x49, 0x46, 0]));
    const entry = { path: 'img/a.gif', sha256: sha256(Buffer.from([0x47, 0x49, 0x46, 0])), size: 4 };
    const opts = { '--baseline-root': before, '--candidate-root': after };
    assert.equal((await verify(entry, opts)).ok, true);
    await writeFile(join(after, 'img', 'a.gif'), Buffer.from([0x47, 0x49, 0x46, 1]));
    assert.equal((await verify(entry, opts)).error, 'CANDIDATE_HASH_MISMATCH');
    assert.equal((await verify({ ...entry, sha256: '0'.repeat(64) }, opts)).error, 'BASELINE_HASH_MISMATCH');
  } finally { await rm(tmp, { recursive: true, force: true }); }
});
