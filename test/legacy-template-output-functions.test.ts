import { describe, expect, it } from "vitest";
import { createTemplateContext, renderTemplate } from "../src/legacy/template/render";

describe("template functions with output side effects", () => {
  it("inserts output at the call site and returns null", () => {
    const sources = new Map([
      ["main", "before<!--{eval bubblebox_start('room');}-->after"]
    ]);
    const context = createTemplateContext({
      loadTemplate: name => sources.get(name),
      constants: new Map([["IN_GAME", true]]),
      writeFunctions: new Map([
        ["bubblebox_start", args => `<div id=\"${String(args[0])}\">`]
      ])
    });

    expect(renderTemplate("main", context)).toBe('before<div id="room">after');
  });

  it("reports output functions through function_exists", () => {
    const sources = new Map([
      ["main", "<!--{if function_exists('bubblebox_end')}-->yes<!--{else}-->no<!--{/if}-->"]
    ]);
    const context = createTemplateContext({
      loadTemplate: name => sources.get(name),
      constants: new Map([["IN_GAME", true]]),
      writeFunctions: new Map([["bubblebox_end", () => "</div>"]])
    });

    expect(renderTemplate("main", context)).toBe("yes");
  });
});
