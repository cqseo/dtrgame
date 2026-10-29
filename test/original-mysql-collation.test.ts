import { describe,it,expect } from "vitest";
import { originalMysqlUsernameKey, originalMysqlUsernameEquals } from "../src/original-mysql-collation";
import { LEGACY_MYSQL_UTF8_WEIGHT_OVERRIDES } from "../src/generated/legacy-mysql-weights";

/** Expected values measured on original MySQL utf8_general_ci, synthetic only. */
const pairs: [string,string,boolean][] = [
 ["Alice","alice",true],["A","Á",true],["e","é",true],["ß","ss",false],
 ["ß","s",true],["İ","i",true],["I","ı",true],
 ["う","ウ",false],["ｶ","カ",false],["a","а",false],
 ["A ","a",true],["æ","ae",false],["œ","oe",false],
 ["张","張",false],["é","é",false],["é","e",false],
 ["áb","áb",false],["a\u00a0","a",false],
 ["a\u200b","a",false],["Ａ","A",false],["aa","a",false],
 ["Α","α",true],["a\u0301b","a\u0301b",true]
];
describe("original MySQL utf8_general_ci username equality",()=> {
 it("contains exactly 1108 source-derived nonidentity BMP weights",()=>{
  expect(LEGACY_MYSQL_UTF8_WEIGHT_OVERRIDES).toHaveLength(1108);
 });
 it.each(pairs)("matches original MySQL equality for %s and %s", (a,b,equals)=>{
  expect(originalMysqlUsernameEquals(a,b)).toBe(equals);
 });
 it("rejects astral non-BMP and invalid UTF-16 input instead of silently replacing",()=>{
  expect(originalMysqlUsernameKey("😀")).toBe(null);
  expect(originalMysqlUsernameKey("\ud800")).toBe(null);
 });
 it("preserves the source-computed weight sequence for mixed CJK and Latin",()=>{
  expect(originalMysqlUsernameKey("Aß张")).toBe("004100535f20");
  expect(originalMysqlUsernameKey("é")).toBe("00450301");
  expect(originalMysqlUsernameKey("hello")).toBe("00480045004c004c004f");
 });
});