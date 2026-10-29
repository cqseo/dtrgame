import { expect, it } from 'vitest';
import { OriginalRuntimeUsers } from '../src/original-runtime-users';
it('writes only lastvisit/IP in the independent QA schema, preserving source users.roomid', async () => {
  let query = ''; let values: readonly unknown[] = [];
  const users = new OriginalRuntimeUsers({ async query<T extends Record<string, unknown>>(sql: string, params: readonly (string | number | null)[]) {
    query = sql; values = params; return { rows: [{ uid: 1 } as unknown as T], rowCount: 1 };
  } });
  await users.saveLogin('QA_login', 1793232000, '192.0.2.9');
  expect(query).toContain('UPDATE acfun_runtime_qa_20261029.users SET ip=$1,lastvisit=$2');
  expect(query).not.toContain('acfun_legacy.');
  expect(query).not.toContain('roomid=');
  expect(values.slice(0, 2)).toEqual(['192.0.2.9', 1793232000]);
});
