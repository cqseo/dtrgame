import {
  applyLegacyRoomCommand,
  createLegacyRoomRecord,
  enterLegacyWaitingRoom,
  type LegacyRoomCommand,
  type LegacyRoomCommandName,
  type LegacyRoomRecord,
  type LegacyRoomRuntimeState
} from "../legacy/room";
import { SupabaseLegacyRest, SupabaseLegacyRooms } from "./supabase";

const COMMANDS = new Set<LegacyRoomCommandName>([
  "newchat", "pos_enter", "pos_disable", "pos_enable", "pos_kick", "rmsetmode",
  "game-option", "leave", "takeover", "ready", "start"
]);

interface InitializeBody { roomId: number; roomType: number; founder: string; now: number; }
interface EnterBody { username: string; }
interface LegacyRoomObjectEnv extends Cloudflare.Env {
  SUPABASE_URL?: string;
  SUPABASE_SECRET_KEY?: string;
}

function json(value: unknown, status = 200): Response {
  return Response.json(value, { status, headers: { "cache-control": "no-store" } });
}

function validTimestamp(value: unknown): number {
  const timestamp = Number(value);
  if (!Number.isSafeInteger(timestamp) || timestamp < 0) throw new RangeError("Invalid timestamp.");
  return timestamp;
}

/** One serialized ACFUN waiting room. SQLite-backed storage is configured in wrangler.jsonc. */
export class LegacyRoomDurableObject {
  #record: LegacyRoomRecord | undefined;
  #queue: Promise<void> = Promise.resolve();
  readonly ctx: DurableObjectState;
  readonly #env: LegacyRoomObjectEnv;

  constructor(ctx: DurableObjectState, env: LegacyRoomObjectEnv) {
    this.ctx = ctx;
    this.#env = env;
    ctx.blockConcurrencyWhile(async () => {
      this.#record = await ctx.storage.get<LegacyRoomRecord>("record");
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/state") {
        return this.#record ? json(this.#record) : json({ error: "房间数据记录不存在。" }, 404);
      }
      if (request.method === "POST" && url.pathname === "/initialize") {
        if (this.#record) return json(this.#record, 200);
        const body = await request.json<InitializeBody>();
        const founder = String(body.founder ?? "");
        if (!founder) return json({ error: "Missing founder." }, 400);
        const roomId = Number(body.roomId);
        const roomType = Number(body.roomType);
        if (!Number.isSafeInteger(roomId) || roomId < 1 || !Number.isSafeInteger(roomType)) {
          return json({ error: "Invalid room identity." }, 400);
        }
        this.#record = createLegacyRoomRecord(roomId, roomType, founder, validTimestamp(body.now));
        await this.ctx.storage.put("record", this.#record);
        return json(this.#record, 201);
      }
      if (request.method === "POST" && url.pathname === "/hydrate") {
        if (this.#record) return json(this.#record, 200);
        const body = await request.json<LegacyRoomRecord>();
        if (!Number.isSafeInteger(body.roomId) || body.roomId < 1 || !body.room || body.room.roomtype !== body.groomtype) {
          return json({ error: "Invalid persisted room." }, 400);
        }
        this.#record = structuredClone(body);
        await this.ctx.storage.put("record", this.#record);
        return json(this.#record, 201);
      }
      if (request.method === "POST" && url.pathname === "/replace") {
        return this.#exclusive(async () => {
          const body = await request.json<LegacyRoomRecord>();
          if (!Number.isSafeInteger(body.roomId) || body.roomId < 1 || !body.room || body.room.roomtype !== body.groomtype) {
            return json({ error: "Invalid persisted room." }, 400);
          }
          this.#record = structuredClone(body);
          await this.ctx.storage.put("record", this.#record);
          return json(this.#record, 201);
        });
      }
      if (request.method === "POST" && url.pathname === "/enter") {
        return this.#exclusive(async () => {
          if (!this.#record) return json({ error: "房间数据记录不存在。" }, 404);
          const body = await request.json<EnterBody>();
          const username = String(body.username ?? "");
          if (!username) return json({ error: "Missing username." }, 400);
          this.#record = enterLegacyWaitingRoom(this.#record, username);
          if (this.#env.SUPABASE_URL && this.#env.SUPABASE_SECRET_KEY) {
            const rest = new SupabaseLegacyRest({ url: this.#env.SUPABASE_URL, secretKey: this.#env.SUPABASE_SECRET_KEY });
            await new SupabaseLegacyRooms(rest).saveRecord(this.#record);
          }
          await this.ctx.storage.put("record", this.#record);
          return json(this.#record);
        });
      }
      if (request.method === "POST" && url.pathname === "/command") {
        const raw = await request.json<Partial<LegacyRoomCommand>>();
        return this.#exclusive(async () => {
          if (!this.#record) return json({ error: "房间数据记录不存在。" }, 404);
          if (!raw.command || !COMMANDS.has(raw.command)) return json({ error: "Unknown room command." }, 400);
          const actor = String(raw.actor ?? "");
          if (!actor) return json({ error: "Missing actor." }, 400);
          const command: LegacyRoomCommand = { command: raw.command, actor, now: validTimestamp(raw.now) };
          if (raw.para1 !== undefined) command.para1 = String(raw.para1);
          if (raw.para2 !== undefined) command.para2 = String(raw.para2);
          const state: LegacyRoomRuntimeState = { record: structuredClone(this.#record) };
          const result = applyLegacyRoomCommand(state, command);
          if (result.changed && this.#env.SUPABASE_URL && this.#env.SUPABASE_SECRET_KEY) {
            const rest = new SupabaseLegacyRest({ url: this.#env.SUPABASE_URL, secretKey: this.#env.SUPABASE_SECRET_KEY });
            await new SupabaseLegacyRooms(rest).saveRecord(result.record);
          }
          this.#record = result.record;
          if (result.changed) await this.ctx.storage.put("record", this.#record);
          return json(result);
        });
      }
      return json({ error: "Not found." }, 404);
    } catch (error) {
      return json({ error: error instanceof Error ? error.message : "Legacy room command failed." }, 409);
    }
  }

  #exclusive<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.#queue.then(operation, operation);
    this.#queue = result.then(() => undefined, () => undefined);
    return result;
  }
}
