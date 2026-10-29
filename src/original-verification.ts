/**
 * Port of the installed ACFUN DTS PHP sources:
 * include/global.func.php:fatenum_create
 * include/user.func.php:register_fatenum_create and register_random_create.
 *
 * Pure functions: all date-dependent inputs are explicit, no random/DB writes.
 * These preserve the original registration challenge values, not new game rules.
 */
import { legacyMd5 } from "./original-auth.ts";

export interface LegacyRegistrationContext {
  nowSeconds: number;
  gameUrl: string;
  day: number;
  month: number;
  year: number;
  weekday: number;
}

/** Returns a DECIMAL STRING, like PHP fatenum_create. Never use JS Number for the hash. */
export function legacyFatenumCreate(seed: string, length = 9): string {
  if (!Number.isInteger(length) || length < 1) throw new RangeError("Invalid legacy fatenum length");
  const len = Math.min(16, length);
  const md5 = legacyMd5(seed);
  const hash = md5.slice(0, len) + md5.slice(-len);
  let digits = hash.replace(/[^0-9]/g, "");
  // PHP empty("0") is true; hexdec fallback is likewise numeric.
  if (digits === "" || digits === "0") digits = String(Number.parseInt(hash.slice(0, 3), 16));
  if (BigInt(digits) < 1997n) digits = String(BigInt(digits) * 999983n);
  return digits;
}

/** The calendar must use the same timezone as original PHP date("j,n,Y,w"). */
export function legacyRegisterFatenumCreate(
  token: string | number,
  ctx: LegacyRegistrationContext,
): string {
  // PHP !$token treats "" and "0" and 0 as empty.
  const originalToken = String(token);
  const effectiveToken = originalToken === "" || originalToken === "0"
    ? String(ctx.nowSeconds) + ctx.gameUrl : originalToken;
  const seed = effectiveToken + ctx.day + ctx.month + ctx.year + ctx.weekday + ctx.gameUrl;
  return legacyFatenumCreate(seed, 10);
}

/** PHP with bcmath enabled: arbitrary-size decimal string modulo exact integer width. */
export function legacyRegisterRandomCreate(
  min: number,
  max: number,
  token: string | number,
  ctx: LegacyRegistrationContext,
): number {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    throw new RangeError("PHP register_random_create requires integer bounds");
  }
  const upper = Math.min(max, 2147483647);
  const lower = min >= upper ? upper - 1 : min;
  const range = BigInt(upper - lower + 1);
  if (range <= 0n) throw new RangeError("Invalid legacy random range");
  return Number(BigInt(legacyRegisterFatenumCreate(token, ctx)) % range) + lower;
}

/**
 * Preserve PHP 64-bit integer overflow and its default 14-significant-digit
 * numeric-to-string casting when register_verification_question_get does += j.
 */
function phpNumberToString(value: number): string {
  if (!Number.isFinite(value)) throw new RangeError("Nonfinite legacy numeric value");
  // PHP default precision=14. All values generated here are nonnegative.
  const [mantissa, exponent] = value.toExponential(13).split("e");
  const compact = mantissa!.replace(/\.?0+$/, "");
  const power = Number(exponent);
  return compact + "E" + (power >= 0 ? "+" : "") + power;
}
function phpAddToSeed(value: string, increment: number): string {
  const bigint = /^\d+$/.test(value) ? BigInt(value) : null;
  const int64max = 9223372036854775807n;
  if (bigint !== null && bigint + BigInt(increment) <= int64max) {
    return (bigint + BigInt(increment)).toString();
  }
  return phpNumberToString(Number(value) + increment);
}

/** Exact original Chinese registration question and option ordering, given original pool. */
export function legacyRegisterVerificationQuestionGet(
  token: string | number,
  pool: readonly string[],
  ctx: LegacyRegistrationContext,
): { question: string; answers: string[]; correct_i: number } {
  if (!pool.length) throw new RangeError("Original verification question pool is empty");
  let entropy = legacyRegisterFatenumCreate(token, ctx);
  const answerLen = legacyRegisterRandomCreate(3, 5, entropy, ctx);
  // PHP (int)fmod() coerces the large decimal seed to double.
  const answerNum = legacyRegisterRandomCreate(5, 7, String(Math.trunc(Number(entropy) % 114514)), ctx);
  const firstIndex = legacyRegisterRandomCreate(0, pool.length - 1, entropy, ctx);
  entropy = legacyRegisterFatenumCreate(entropy, ctx);
  const originalSentence = (pool[firstIndex] ?? "").trim();
  const chars = [...originalSentence];
  const offset = legacyRegisterRandomCreate(2, chars.length - 1 - answerLen, entropy, ctx);
  entropy = legacyRegisterFatenumCreate(entropy, ctx);
  const correct = chars.slice(offset, offset + answerLen).join("");
  const question = chars.slice(0, offset).join("") + "▁▁▁▁" + chars.slice(offset + answerLen).join("");
  const wrong: string[] = [];
  for (let i = 0; i < answerNum; i++) {
    let candidate = "";
    let j = 0;
    do {
      const index = legacyRegisterRandomCreate(0, pool.length - 1, entropy, ctx);
      entropy = legacyRegisterFatenumCreate(entropy, ctx);
      const sentence = [...(pool[index] ?? "").trim()];
      const start = legacyRegisterRandomCreate(0, sentence.length - 1 - answerLen, entropy, ctx);
      entropy = legacyRegisterFatenumCreate(entropy, ctx);
      candidate = sentence.slice(start, start + answerLen).join("");
      j++;
      entropy = phpAddToSeed(entropy, j);
      if (j > 1000) break;
    } while (candidate === correct || wrong.includes(candidate));
    wrong.push(candidate);
  }
  const correct_i = legacyRegisterRandomCreate(0, answerNum - 1, entropy, ctx);
  return {
    question,
    answers: wrong.map((word, index) => index === correct_i ? correct : word),
    correct_i,
  };
}