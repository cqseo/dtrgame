/**
 * MD5, because the original's accounts are MD5 and have to keep working.
 *
 * acbra2_users.password is char(32) and create_cookiepass() builds it
 * with md5(). Every account that exists today was created that way, so a
 * port that hashes differently cannot log any of them in. That makes
 * this a compatibility requirement, not a security choice -- MD5 is not
 * a sound password hash, and replacing it is a separate decision that
 * would need a migration, not a quiet substitution here.
 *
 * It is written out rather than taken from crypto.subtle, which does not
 * offer MD5 and is asynchronous, while the interpreter running the
 * original's code is synchronous throughout.
 *
 * Held to PHP's own md5() by test/legacy-md5.parity.test.mjs.
 */

/** Per-round shift amounts. */
const SHIFTS = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];

/** K[i] = floor(2^32 * abs(sin(i + 1))), computed once. */
const K = new Uint32Array(64);
for (let i = 0; i < 64; i += 1) {
  K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 0x1_0000_0000) >>> 0;
}

const rotateLeft = (value: number, count: number): number =>
  ((value << count) | (value >>> (32 - count))) >>> 0;

/**
 * Hashes bytes, not characters.
 *
 * PHP's md5() works on the string's bytes, and the original's strings
 * are UTF-8, so a name with Chinese characters must be encoded before
 * hashing or the digest differs from the one in the database.
 */
export function md5Bytes(input: Uint8Array): string {
  const bitLength = input.length * 8;
  // One 0x80 byte, then zeros, then the length as 8 bytes little-endian.
  const padded = new Uint8Array(((input.length + 8) >> 6) * 64 + 64);
  padded.set(input);
  padded[input.length] = 0x80;

  const view = new DataView(padded.buffer);
  // Only the low 32 bits of the length are written; the original never
  // hashes anything near 512MB, where the high word would matter.
  view.setUint32(padded.length - 8, bitLength >>> 0, true);
  view.setUint32(padded.length - 4, Math.floor(bitLength / 0x1_0000_0000), true);

  let a0 = 0x67452301;
  let b0 = 0xefcdab89;
  let c0 = 0x98badcfe;
  let d0 = 0x10325476;

  const block = new Uint32Array(16);
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let word = 0; word < 16; word += 1) {
      block[word] = view.getUint32(offset + word * 4, true);
    }

    let a = a0;
    let b = b0;
    let c = c0;
    let d = d0;

    for (let i = 0; i < 64; i += 1) {
      let f: number;
      let g: number;
      if (i < 16) {
        f = (b & c) | (~b & d);
        g = i;
      } else if (i < 32) {
        f = (d & b) | (~d & c);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = b ^ c ^ d;
        g = (3 * i + 5) % 16;
      } else {
        f = c ^ (b | ~d);
        g = (7 * i) % 16;
      }
      const sum = (f + a + (K[i] as number) + (block[g] as number)) >>> 0;
      a = d;
      d = c;
      c = b;
      b = (b + rotateLeft(sum, SHIFTS[i] as number)) >>> 0;
    }

    a0 = (a0 + a) >>> 0;
    b0 = (b0 + b) >>> 0;
    c0 = (c0 + c) >>> 0;
    d0 = (d0 + d) >>> 0;
  }

  const digest = new Uint8Array(16);
  const out = new DataView(digest.buffer);
  out.setUint32(0, a0, true);
  out.setUint32(4, b0, true);
  out.setUint32(8, c0, true);
  out.setUint32(12, d0, true);

  let hex = "";
  for (const byte of digest) hex += byte.toString(16).padStart(2, "0");
  return hex;
}

const encoder = new TextEncoder();

/** PHP's md5($string): lowercase hex of the UTF-8 bytes. */
export function md5(input: string): string {
  return md5Bytes(encoder.encode(input));
}
