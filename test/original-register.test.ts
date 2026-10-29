import { describe, expect, it } from "vitest";
import {
  legacyInputFilter, legacyRegisterPost, legacyRegisterAjaxResponse,
  LEGACY_REGISTER_STRINGS, type LegacyRegistrationAccount,
  type LegacyRegistrationEnvironment, type LegacyRegistrationStore
} from "../src/original-register";
import { legacyRegisterVerificationQuestionGet } from "../src/original-verification";
import { LEGACY_VQ_POOL } from "../src/generated/legacy-vq-pool";
import { legacyDecode } from "../src/original-protocol";
import { legacyStoredPassword, legacyCookiePassword } from "../src/original-auth";
import { legacyAuthenticateForm, legacyAuthenticateCookies } from "../src/original-login";

const clock = {
  nowSeconds: 1793242800,
  gameUrl: "https://dts.example.invalid/",
  day: 29, month: 10, year: 2026, weekday: 4,
};
function env(overrides: Partial<LegacyRegistrationEnvironment> = {}): LegacyRegistrationEnvironment {
  return {
    clock, sourceIp: "127.0.0.1", cookiePrefix: "acbra2_",
    cookiePath: "/", secureCookies: true, authenticated: false,
    bannedNames: null, bannedIp: null, ...overrides,
  };
}
class MemoryStore implements LegacyRegistrationStore {
  readonly records = new Map<string, LegacyRegistrationAccount>();
  async exists(username: string): Promise<boolean> { return this.records.has(username); }
  async insert(record: LegacyRegistrationAccount): Promise<boolean> {
    if (this.records.has(record.username)) return false;
    this.records.set(record.username, record);
    return true;
  }
}
function form(user = "ParityPlayer"): URLSearchParams {
  const token = "12345";
  const challenge = legacyRegisterVerificationQuestionGet(token, LEGACY_VQ_POOL, clock);
  return new URLSearchParams({
    cmd:"post_register",
    username:user, npass:"a!password2026", rnpass:"a!password2026",
    register_token:token, vq_answer:String(challenge.correct_i),
    gender:"m", icon:"0", motto:"Hello", killmsg:"Fight", lastword:"Bye"
  });
}
function unwrap(outcome: Awaited<ReturnType<typeof legacyRegisterPost>>) {
  if (outcome.kind !== "ajax") throw Error("Expected original AJAX data");
  return outcome;
}

describe("original PHP input filter golden cases from installed global.func.php", () => {
  it.each([
    ["plain", "plain"],
    ["a'b\\c", "abc"],
    ["a___b", "ab"],
    ["你好<世界&\"你好", "你好&lt;世界&amp;&quot;你好"],
    ["name ;", "name ;"],
    ["abc\n123", "abc\n123"],
    ["👋", "👋"],
    ["'\\<<<&&\"\"___", "&lt;&lt;&lt;&amp;&amp;&quot;&quot;"],
  ])("preserves PHP gstrfilter output", (input, golden) => {
    expect(legacyInputFilter(input)).toBe(golden);
  });
});

describe("original register.php POST response with isolated in-memory accounts", () => {
  it("persists original 12-field registration record; returns old cookies and client payload", async () => {
    const store=new MemoryStore();
    const result=unwrap(await legacyRegisterPost(form(),env(),store));
    expect(result.created).toBe(true);
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.reg_success);
    expect(result.payload.innerHTML.postreg).toContain("返回游戏首页");
    expect(result.cookies).toHaveLength(2);
    expect(result.cookies[0]).toBe("acbra2_user=ParityPlayer; Path=/; Secure");
    expect(result.cookies[1]).toContain("acbra2_pass=" + legacyCookiePassword("a!password2026") + "; Path=/; Secure; HttpOnly");
    expect(result.cookies.join("|")).not.toContain("a!password2026");
    const record=store.records.get("ParityPlayer");
    expect(record).toMatchObject({username:"ParityPlayer", alt_pswd:1, groupid:1,
      ip:"127.0.0.1",credits:0,gold:100,gender:"m",icon:"0",
      motto:"Hello",killmsg:"Fight",lastword:"Bye" });
    expect(record?.password).toBe(legacyStoredPassword("ParityPlayer",legacyCookiePassword("a!password2026")));
    expect(await legacyDecode(record!.card_data)).toEqual([{cardid:0,cardenergy:0}]);
    const response=await legacyRegisterAjaxResponse(result);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect((await legacyDecode<{innerHTML:Record<string,string>}>(await response.text())).innerHTML.info)
      .toBe(LEGACY_REGISTER_STRINGS.reg_success);
    expect(response.headers.getSetCookie()).toHaveLength(2);
  });
  it("original registration does not extend cookie lifetime like login",async () => {
    const result=unwrap(await legacyRegisterPost(form(),env({secureCookies:false}),new MemoryStore()));
    expect(result.cookies.every(cookie=>!cookie.includes("Expires=") && !cookie.includes("Max-Age="))).toBe(true);
    expect(result.cookies.every(cookie=>!cookie.includes("SameSite="))).toBe(true);
  });
  it("rejects name, invalid password and bad captcha in original validation order", async () => {
    const store=new MemoryStore();
    const badName=form("bad;name"); badName.set("npass","different");
    let result=unwrap(await legacyRegisterPost(badName,env(),store));
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.name_invalid);
    const badPass=form();badPass.set("rnpass","mismatch");
    result=unwrap(await legacyRegisterPost(badPass,env(),store));
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.pass_not_match);
    const noToken=form();noToken.delete("register_token");
    result=unwrap(await legacyRegisterPost(noToken,env(),store));
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.vq_answer_retry);
    const badCaptcha=form();badCaptcha.set("vq_answer","-1");
    result=unwrap(await legacyRegisterPost(badCaptcha,env(),store));
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.vq_answer_wrong);
    expect(store.records.size).toBe(0);
  });
  it("enforces bans before captcha and rejects duplicates without overwriting original account",async () => {
    const store=new MemoryStore();
    let result=unwrap(await legacyRegisterPost(form("forbidden"),env({bannedNames:/^forbidden$/}),store));
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.name_banned);
    result=unwrap(await legacyRegisterPost(form(),env({bannedIp:/^127\./}),store));
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.ip_banned);
    const first=unwrap(await legacyRegisterPost(form(),env(),store));
    const originalHash=store.records.get("ParityPlayer")!.password;
    result=unwrap(await legacyRegisterPost(form(),env(),store));
    expect(first.created).toBe(true);
    expect(result.created).toBe(false);
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.name_exists);
    expect(result.cookies).toHaveLength(0);
    expect(store.records.get("ParityPlayer")!.password).toBe(originalHash);
  });
  it("returns original database error if atomic insert fails and never creates login cookies",async () => {
    const store:LegacyRegistrationStore = {exists:async()=>false, insert:async()=>{throw Error("private SQL error");}};
    const result=unwrap(await legacyRegisterPost(form(),env(),store));
    expect(result.payload.innerHTML.info).toBe(LEGACY_REGISTER_STRINGS.db_failure);
    expect(result.cookies).toHaveLength(0);
    expect(JSON.stringify(result)).not.toContain("private SQL error");
  });
  it("does not convert already-authenticated registration into a successful AJAX response",async () => {
    const result=await legacyRegisterPost(form(),env({authenticated:true}),new MemoryStore());
    expect(result.kind).toBe("already-logged-in");
    expect((await legacyRegisterAjaxResponse(result)).status).toBe(501);
  });
  it("preserves DOM value names and refreshes the old question on both failed and successful requests",async () => {
    const store = new MemoryStore(),args=form();
    const first=unwrap(await legacyRegisterPost(args,env(),store));
    const second=unwrap(await legacyRegisterPost(args,env(),store));
    const expected=legacyRegisterVerificationQuestionGet(first.payload.value.register_token,LEGACY_VQ_POOL,clock);
    expect(first.payload.innerHTML.vq_question).toBe(expected.question);
    expect(first.payload.innerHTML.vq_answer_disp0).toBe(expected.answers[0]);
    expect(second.payload.value.register_token).toBe(first.payload.value.register_token);
    expect(Object.keys(first.payload.innerHTML)).toContain("vq_answer_disp"+String(expected.answers.length-1));
  });
});

describe("original registration-to-login credential compatibility", () => {
  it("registers a synthetic account and verifies both original login form and original cookie pair", async () => {
    const store = new MemoryStore();
    const result = unwrap(await legacyRegisterPost(form(),env(),store));
    const userStore = {
      async findByUsername(username: string) {
        const row = store.records.get(username);
        return row ? { username:row.username, password:row.password, groupid:row.groupid, roomid:0 } : null;
      }
    };
    const login = await legacyAuthenticateForm(
      new URLSearchParams({username:"ParityPlayer",password:"a!password2026"}), userStore
    );
    expect(login.ok).toBe(true);
    const cookieAuth = await legacyAuthenticateCookies(result.cookies.join("; "),userStore,"acbra2_");
    expect(cookieAuth?.username).toBe("ParityPlayer");
    const invalid = await legacyAuthenticateForm(
      new URLSearchParams({username:"ParityPlayer",password:"wrong123"}),userStore
    );
    expect(invalid).toEqual({ok:false,error:"wrong_pw"});
  });
});
