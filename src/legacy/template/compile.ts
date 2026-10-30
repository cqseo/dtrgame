/**
 * Port of the original's include/template.func.php `parse_template`.
 *
 * The original compiles each .htm into PHP through a fixed chain of text
 * rewrites, and the bytes it emits depend on every one of them: indent
 * stripping, {LF}, the variable-variable detour through [@[ ]@], constant
 * substitution, div newline collapsing, nospace and transamp. The compiled
 * text is therefore reproduced rewrite for rewrite rather than reinterpreted,
 * and only the evaluation of the resulting PHP is new.
 *
 * PHP's character classes operate on UTF-8 bytes, so `\x7f-\xff` there means
 * "any byte of a multibyte character". The equivalent here is \u007f-￿,
 * which admits the same identifiers.
 */

const HIGH = "\\u007f-\\uffff";

/** Matches `$name`, `$name[key]`, `$name[key][key2]`. */
const VAR_PATTERN = `((\\$[a-zA-Z_${HIGH}][a-zA-Z0-9_${HIGH}]*)(\\[[a-zA-Z0-9_\\-.\"'\\[\\]$${HIGH}]+\\])*)`;

const CONST_PATTERN = `([a-zA-Z_${HIGH}][a-zA-Z0-9_${HIGH}]*)`;

/** How deep {if} and {loop} may nest; the original runs 10 passes. */
const NEST_PASSES = 10;

export interface CompileOptions {
  /** templates.lang.php for the active pack, used by {lang x}. */
  language?: Readonly<Record<string, string>>;
  /** Resolves {template_fixed x} to that template's compiled text. */
  resolveFixed?: (name: string) => string;
  /** The original's $nospace argument; every call the game makes passes 1. */
  nospace?: boolean;
}

/** Port of the original's addquote(). */
function addquote(value: string): string {
  return value.replace(/\[([a-zA-Z0-9_\-.\u007f-￿]+)\]/gs, "['$1']").replace(/\\"/g, '"');
}

/** Port of the original's stripvtags(). */
function stripvtags(expression: string, statement: string): string {
  return expression.replace(/<\?=(\$[\s\S]+?)\?>/g, "$1").replace(/\\"/g, '"') + statement.replace(/\\"/g, '"');
}

/** Port of the original's transamp(). */
function transamp(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/&amp;amp;/g, "&amp;").replace(/\\"/g, '"');
}

/** Port of the original's languagevar(): unknown keys render as !key!. */
function languagevar(name: string, language: Readonly<Record<string, string>>): string {
  const value = language[name];
  return value === undefined ? `!${name}!` : value;
}

export function compileTemplate(source: string, options: CompileOptions = {}): string {
  const language = options.language ?? {};
  const nospace = options.nospace ?? true;
  let template = source;

  // Remove indentation that follows a line break.
  template = template.replace(/([\r\n]+)\t+/g, "$1");
  // <!--{x}--> keeps templates valid HTML; it means {x}.
  template = template.replace(/<!--\{([\s\S]+?)\}-->/g, "{$1}");
  // {lang x} is substituted at compile time, not at render time.
  template = template.replace(/\{lang\s+([\s\S]+?)\}/gi, (_m, name: string) => languagevar(name, language));
  template = template.replace(/\{LF\}/g, '<?="\\n"?>');

  // {$var} and bare $var[key] become echoes; bare keys gain quotes.
  template = template.replace(new RegExp(`\\{(\\$[a-zA-Z0-9_\\[\\]'"$.${HIGH}]+)\\}`, "g"), "<?=$1?>");
  template = template.replace(new RegExp(VAR_PATTERN, "g"), match => addquote(`<?=${match}?>`));
  template = template.replace(new RegExp(`<\\?=<\\?=${VAR_PATTERN}\\?>\\?>`, "g"), (_m, inner: string) =>
    addquote(`<?=${inner}?>`)
  );

  // Variable variables: ${'ar'.$apl.'s'} survives the rewrites above as
  // ${'ar'.<?=$apl?>.'s'}. The braces are parked as [@[ ]@] so they cannot be
  // mistaken for directives, and restored once if/loop have been handled.
  template = template.replace(
    new RegExp(
      `\\$\\{(['"][a-zA-Z0-9_]*['"]\\.)*<\\?=(\\$[a-zA-Z0-9_\\[\\]'"$.${HIGH}]+)\\?>(\\.['"][a-zA-Z0-9_]*['"])*\\}`,
      "g"
    ),
    (_m, before: string = "", name: string = "", after: string = "") =>
      `<?=$[@[${before ?? ""}${name}${after ?? ""}]@]?>`
  );
  template = template.replace(
    new RegExp(`\\$<\\?=<\\?=(\\$[a-zA-Z0-9_\\[\\]'"$.${HIGH}]+)\\?>(\\.['"][a-zA-Z0-9_]*['"])*\\?>`, "g"),
    (_m, name: string = "", after: string = "") => `<?=$[@[${name}${after ?? ""}]@]?>`
  );
  template = template.replace(/\{<\?=\$\[@\[([\s\S]*)\]@\]\?>\}/g, "<?=$[@[$1]@]?>");

  template = `<? if(!defined('IN_GAME')) exit('Access Denied'); ?>\n${template}`;

  // {template x} with a literal name, then with an expression.
  template = template.replace(
    /[\n\r\t]*\{template\s+([a-z0-9_]+)\}[\n\r\t]*/gi,
    "\n<? include template('$1'); ?>\n"
  );
  template = template.replace(/[\n\r\t]*\{template\s+([\s\S]+?)\}[\n\r\t]*/gi, (_m, expression: string) =>
    stripvtags(`\n<? include template(${expression}); ?>\n`, "")
  );

  template = template.replace(/[\n\r\t]*\{eval\s+([\s\S]+?)\}[\n\r\t]*/gi, (_m, code: string) =>
    stripvtags(`\n<? ${code} ?>\n`, "")
  );
  template = template.replace(/[\n\r\t]*\{echo\s+([\s\S]+?)\}[\n\r\t]*/gi, (_m, code: string) =>
    stripvtags(`\n<? echo ${code}; ?>\n`, "")
  );
  template = template.replace(/[\n\r\t]*\{elseif\s+([\s\S]+?)\}[\n\r\t]*/gi, (_m, code: string) =>
    stripvtags(`\n<? } elseif(${code}) { ?>\n`, "")
  );
  template = template.replace(/[\n\r\t]*\{else\}[\n\r\t]*/gi, "\n<? } else { ?>\n");

  // The original resolves nesting by running the same three rewrites ten
  // times, innermost pair first, so the pass count is kept identical.
  for (let pass = 0; pass < NEST_PASSES; pass++) {
    template = template.replace(
      /[\n\r\t]*\{loop\s+(\S+)\s+(\S+)\}[\n\r]*([\s\S]+?)[\n\r]*\{\/loop\}[\n\r\t]*/gi,
      (_m, list: string, item: string, body: string) =>
        stripvtags(`\n<? if(is_array(${list})) { foreach(${list} as ${item}) { ?>`, `\n${body}\n<? } } ?>\n`)
    );
    template = template.replace(
      /[\n\r\t]*\{loop\s+(\S+)\s+(\S+)\s+(\S+)\}[\n\r\t]*([\s\S]+?)[\n\r\t]*\{\/loop\}[\n\r\t]*/gi,
      (_m, list: string, key: string, value: string, body: string) =>
        stripvtags(
          `\n<? if(is_array(${list})) { foreach(${list} as ${key} => ${value}) { ?>`,
          `\n${body}\n<? } } ?>\n`
        )
    );
    template = template.replace(
      /[\n\r\t]*\{if\s+([\s\S]+?)\}[\n\r]*([\s\S]+?)[\n\r]*\{\/if\}[\n\r\t]*/gi,
      (_m, condition: string, body: string) =>
        stripvtags(`\n<? if(${condition}) { ?>`, `\n${body}\n<? } ?>\n`)
    );
  }

  template = template.split("[@[").join("{").split("]@]").join("}");
  template = template.replace(new RegExp(`\\{${CONST_PATTERN}\\}`, "g"), "<?=$1?>");
  template = template.replace(/ \?>[\n\r]*<\? /g, " ");

  template = template.replace(/<\?/g, "<?php");
  template = template.replace(/<\?php=/g, "<?php echo ");

  template = template.replace(/div>[\r\n]+<div/g, "div><div");

  if (nospace) {
    template = template.split("\n<?").join("<?").split("?>\n").join("?>");
  }

  template = template.replace(/"(http)?[\w./:]+\?[^"]+?&[^"]+?"/g, match => transamp(match));

  if (options.resolveFixed) {
    const resolveFixed = options.resolveFixed;
    template = template.replace(/[\n\r\t]*\{template_fixed\s+([a-z0-9_]+)\}[\n\r\t]*/gi, (_m, name: string) =>
      resolveFixed(name)
        .split("if(!defined('IN_GAME')) exit('Access Denied'); ")
        .join("")
        .split("<?php ?>")
        .join("")
    );
  }

  return template;
}
