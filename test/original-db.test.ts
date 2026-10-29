import { describe, expect, it, vi } from "vitest";
import { D1LegacyAccounts, D1LegacyRooms, type OriginalD1 } from "../src/original-db";

function storeWithRow(row: Record<string, unknown> | null) {
  const first = vi.fn(async () => row), run = vi.fn(async () => ({ success: true, meta: { changes: 1 } }));
  const bind = vi.fn((..._args: (string | number | null)[]) => ({ first, run }));
  const prepare = vi.fn((_sql: string) => ({ bind }));
  return { db: { prepare } as unknown as OriginalD1, prepare, bind, first, run };
}
describe("actual Cloudflare D1 adapter to original account/room schema", () => {
  it("uses parameterized SQL for legacy account lookups", async () => {
    const { db, prepare, bind } = storeWithRow({ username: "测试用户", password: "hash", groupid: 1, roomid: 0 });
    const row = await new D1LegacyAccounts(db).findByUsername("测试用户");
    expect(row?.username).toBe("测试用户");
    expect(prepare.mock.calls[0]?.[0]).toMatch(/username = \?/);
    expect(bind.mock.calls[0]?.[0]).toBe("测试用户");
  });
  it("rejects malformed usernames before database queries", async () => {
    const { db, prepare } = storeWithRow(null);
    expect(await new D1LegacyAccounts(db).findByUsername("x".repeat(16))).toBeNull();
    expect(prepare).not.toHaveBeenCalled();
  });
  it("updates old PHP lastvisit as Unix timestamp", async () => {
    const { db, prepare, bind, run } = storeWithRow(null);
    await new D1LegacyAccounts(db).recordLastLogin("user", 1793190400);
    expect(prepare.mock.calls[0]?.[0]).toMatch(/UPDATE legacy_users SET lastvisit = \?/);
    expect(bind.mock.calls[0]).toEqual([1793190400, "user"]);
    expect(run).toHaveBeenCalledOnce();
  });
  it("uses old room identifiers and rejects invalid IDs", async () => {
    const { db, bind, prepare } = storeWithRow({ groomid: 14, groomtype: 7, groomstatus: 10, roomvars: "", gamevars: "", raw_record: "{}" });
    const repo = new D1LegacyRooms(db);
    expect((await repo.find(14))?.groomtype).toBe(7);
    expect(bind.mock.calls[0]?.[0]).toBe(14);
    expect(await repo.find(-1)).toBeNull();
    expect(await repo.find(256)).toBeNull();
    expect(prepare).toHaveBeenCalledTimes(1);
  });
});
