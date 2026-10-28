/**
 * Account compatibility with the actual installed ACFUN DTS PHP user.func.php.
 *
 * Original operations:
 *   create_cookiepass(pass) = md5(pass)
 *   create_storedpass(username, cookiePass) = md5(username + cookiePass)
 *   pass_compare(username, cookiePass, dbHash) accepts salted or legacy raw
 *     cookie hash depending on oldpswdcmp (enabled by default).
 *
 * WARNING: MD5 is deliberately reproduced ONLY to verify historical accounts
 * during a controlled migration. It is NOT suitable for new authentication.
 * No password is persisted or logged here.
 */
const ROTATIONS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
] as const;
const CONSTANTS = Array.from({ length: 64 }, (_, i) =>
  Math.floor(Math.abs(Math.sin(i + 1)) * 0x100000000) >>> 0
);
function rotate(x: number, shift: number): number {
  return (x << shift) | (x >>> (32 - shift));
}
export function legacyMd5(value: string): string {
  const data = new TextEncoder().encode(value);
  const count = Math.ceil((data.length + 9) / 64) * 64;
  const msg = new Uint8Array(count);
  msg.set(data);
  msg[data.length] = 0x80;
  const bitCount = BigInt(data.length) * 8n;
  for (let i = 0; i < 8; i++) {
    msg[count - 8 + i] = Number((bitCount >> BigInt(i * 8)) & 0xffn);
  }
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const words = new Uint32Array(16);
  for (let start = 0; start < count; start += 64) {
    for (let i = 0; i < 16; i++) {
      const at = start + i * 4;
      words[i] = (msg[at]! | (msg[at + 1]! << 8) |
        (msg[at + 2]! << 16) | (msg[at + 3]! << 24)) >>> 0;
    }
    let a = a0, b = b0, c = c0, d = d0;
    for (let i = 0; i < 64; i++) {
      let f: number, g: number;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      const sum = (a + f + CONSTANTS[i]! + words[g]!) >>> 0;
      a = d; d = c; c = b;
      b = (b + rotate(sum, ROTATIONS[i]!)) >>> 0;
    }
    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }
  return [a0, b0, c0, d0]
    .map((w) => [0, 8, 16, 24].map((shift) =>
      ((w >>> shift) & 0xff).toString(16).padStart(2, "0")).join(""))
    .join("");
}
export function legacyCookiePassword(rawPassword: string): string {
  return legacyMd5(rawPassword);
}
export function legacyStoredPassword(username: string, cookiePassword: string): string {
  return legacyMd5(username + cookiePassword);
}
/** Constant-time for same-length ASCII digest strings; do not compare raw secrets. */
function equalDigest(a: string, b: string): boolean {
  let difference = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return difference === 0;
}
export function legacyPasswordMatches(
  username: string,
  cookiePassword: string,
  databaseHash: string,
  allowUnsaltedHistoricalHash = true
): boolean {
  const salted = legacyStoredPassword(username, cookiePassword);
  const saltedMatch = equalDigest(salted, databaseHash);
  const unsaltedMatch = equalDigest(cookiePassword, databaseHash);
  return saltedMatch || (allowUnsaltedHistoricalHash && unsaltedMatch);
}
export type LegacyUsernameValidity =
  "name_ok" | "name_not_set" | "name_too_long" | "name_invalid" | "name_banned";
export function legacyUsernameCheck(username: string | null | undefined, bannedNames?: RegExp): LegacyUsernameValidity {
  if (!username) return "name_not_set";
  if ([...username].length > 15) return "name_too_long";
  if (/[\s?+'|,<>&;#"]|\p{C}/u.test(username)) return "name_invalid";
  if (bannedNames?.test(username)) return "name_banned";
  return "name_ok";
}
export type LegacyPasswordValidity =
  "pass_ok" | "pass_not_set" | "pass_not_match" | "pass_too_long";
export function legacyPasswordCheck(password: string | null | undefined, repeated: string | null | undefined): LegacyPasswordValidity {
  if (!password || !repeated) return "pass_not_set";
  if (password !== repeated) return "pass_not_match";
  // The customized PHP fork uses mb_strlen(..., "utf-8") rather than byte strlen.
  if ([...password].length > 24) return "pass_too_long";
  // The installed PHP source explicitly comments out its <4 byte rejection.
  return "pass_ok";
}
