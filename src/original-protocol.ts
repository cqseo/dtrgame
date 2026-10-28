/**
 * ACFUN DTS original command.php wire protocol.
 *
 * Baota source include/global.func.php:
 *   gencode($para) = base64_encode(gzencode(json_encode($para)))
 *   gdecode($para) = json_decode(gzinflate(substr(base64_decode($para), 10, -8)))
 *
 * Original browser client include/javascript/game.20240318.js:
 *   showData(responseText) -> JXG.decompress(responseText) -> JSON.parse(...)
 *
 * These helpers preserve the original client protocol without PHP on Workers.
 */
function toBase64(bytes: Uint8Array): string {
  let result = "";
  for (let index = 0; index < bytes.length; index += 8192) {
    result += String.fromCharCode(...bytes.subarray(index, index + 8192));
  }
  return btoa(result);
}
function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
}
export async function legacyEncode(payload: unknown): Promise<string> {
  const json = JSON.stringify(payload);
  if (json === undefined) throw new TypeError("Legacy wire payload must be JSON-serializable");
  const input = new Blob([new TextEncoder().encode(json)]);
  const compressed = await new Response(input.stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer();
  return toBase64(new Uint8Array(compressed));
}
export async function legacyDecode<T = unknown>(value: string): Promise<T> {
  if (!value) return [] as T;
  const input = new Blob([fromBase64(value)]);
  const decompressed = await new Response(input.stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
  return JSON.parse(new TextDecoder().decode(decompressed)) as T;
}
