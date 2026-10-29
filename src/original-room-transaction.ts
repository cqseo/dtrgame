/**
 * Stage-only original DTS room-wide PostgreSQL transaction + advisory lock.
 *
 * Original PHP uses a daemon + per-player filesystem locks, and room
 * resets. Supabase staging must not permit a maptrap/mapitem DELETE
 * to commit separately from the player/room/news updates.
 *
 * This is a correctness primitive, not production concurrency acceptance.
 */
import type { PgLegacyClient } from "./original-supabase-db";
export type OriginalRoomId=0|1|2|3|4|5|6|8;
function validateRoom(id:number):asserts id is OriginalRoomId {
 if(!Number.isSafeInteger(id)||![0,1,2,3,4,5,6,8].includes(id))
   throw new RangeError("Original game room ID is invalid");
}
export interface OriginalRoomTxClient extends PgLegacyClient {
 /** A dedicated PG connection, never a pool.query hop across sessions. */
 readonly singleSession:true;
}
export interface OriginalRoomTxOptions {
 /** Error/rollbacks cannot be swallowed; only QA may call this module. */
 readonly purpose:"qa-only";
 readonly roomId:number;
 readonly transactionTimeoutMs?:number;
}
export async function originalWithRoomTransaction<T>(
 client:OriginalRoomTxClient,
 options:OriginalRoomTxOptions,
 run:(client:OriginalRoomTxClient)=>Promise<T>
):Promise<T>{
 if(options.purpose!=="qa-only")throw new Error("No production room cutover approval");
 validateRoom(options.roomId);
 if(client.singleSession!==true)
  throw new Error("Room transaction needs a single dedicated PG session");
 const timeout=options.transactionTimeoutMs??30000;
 if(!Number.isSafeInteger(timeout)||timeout<1000||timeout>120000)
  throw new RangeError("Invalid isolated transaction timeout");
 await client.query("BEGIN",[]);
 let inTransaction=true;
 try{
  // A room-scoped exclusive lock, transaction lifetime only.
  // No other game room shares the second advisory-lock key.
  await client.query("SELECT pg_advisory_xact_lock($1,$2)",
   [20261029,options.roomId]);
  await client.query("SELECT set_config('statement_timeout',$1,true)",[String(timeout)]);
  const result=await run(client);
  await client.query("COMMIT",[]);
  inTransaction=false;
  return result;
 } catch(error){
  if(inTransaction){
   try{await client.query("ROLLBACK",[])}catch{
    // Preserve initial failure; dedicated client must be discarded.
   }
  }
  throw error;
 }
}
