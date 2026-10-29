import { describe, expect, it } from "vitest";
import { parseLegacyForm, toLegacyRoomCommand } from "../src/runtime/command";
import { legacyDecode } from "../src/original-protocol";
import { legacyCommandResponse } from "../src/runtime/command";

describe("legacy command request bridge", () => {
  it("parses the original form body and produces a typed room command", async () => {
    const request = new Request("https://game.test/roomcmd.php", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "command=newchat&para1=%3Cb%3Ehello%3C%2Fb%3E"
    });
    const form = await parseLegacyForm(request);
    expect(toLegacyRoomCommand(form, "玩家", 123)).toEqual({
      command: "newchat", actor: "玩家", para1: "&lt;b&gt;hello&lt;/b&gt;", now: 123
    });
  });

  it("returns the original gzip/base64 wire format", async () => {
    const response = await legacyCommandResponse({ innerHTML: { notice: "完成" } });
    expect(response.headers.get("content-type")).toBe("text/plain;charset=utf-8");
    expect(await legacyDecode(await response.text())).toEqual({ innerHTML: { notice: "完成" } });
  });
});
