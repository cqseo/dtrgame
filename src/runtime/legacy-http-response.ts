import type { HostFunction } from "../legacy/template/builtins";
import { PhpArray, toBool, toStringValue } from "../legacy/template/values";

/** Request-local HTTP effects emitted by the original PHP program. */
export class LegacyHttpResponse {
  status = 200;
  readonly headers = new Headers({
    "content-type": "text/html; charset=UTF-8",
    "cache-control": "no-store"
  });

  functions(): Map<string, HostFunction> {
    return new Map<string, HostFunction>([
      ["http_response_code", args => {
        const previous = this.status;
        if (args.length) this.setStatus(Number(args[0]));
        return previous;
      }],
      ["header", args => {
        const line = toStringValue(args[0] ?? null);
        if (/[\r\n]/.test(line)) throw new Error("Invalid HTTP header.");
        const status = /^HTTP\/\S+\s+(\d{3})/.exec(line);
        if (status) { this.setStatus(Number(status[1])); return null; }
        const colon = line.indexOf(":");
        if (colon < 1) return null;
        const name = line.slice(0, colon).trim();
        const value = line.slice(colon + 1).trim();
        if (args[1] === undefined || toBool(args[1])) this.headers.set(name, value);
        else this.headers.append(name, value);
        if (name.toLowerCase() === "location" && this.status !== 201 &&
            (this.status < 300 || this.status > 399)) this.status = 302;
        if (args[2]) this.setStatus(Number(args[2]));
        return null;
      }],
      ["header_remove", args => {
        if (args.length) this.headers.delete(toStringValue(args[0] ?? null));
        else for (const name of [...this.headers.keys()]) this.headers.delete(name);
        return null;
      }],
      ["headers_sent", () => false],
      ["headers_list", () => {
        const result = new PhpArray();
        for (const [name, value] of this.headers) result.push(`${name}: ${value}`);
        return result;
      }],
      ["setcookie", args => {
        const name = toStringValue(args[0] ?? null);
        const value = toStringValue(args[1] ?? null);
        if (!name || /[=,;\s\x00-\x1f\x7f]/.test(name)) throw new Error("Invalid cookie name.");
        const path = toStringValue(args[3] ?? null);
        const domain = toStringValue(args[4] ?? null);
        if (/[;\r\n\x00]/.test(path + domain)) throw new Error("Invalid cookie attribute.");
        const encoded = encodeURIComponent(value).replace(/[!'()*]/g,
          character => `%${character.charCodeAt(0).toString(16).toUpperCase()}`).replace(/%20/g, "+");
        let cookie = `${name}=${value === "" ? "deleted" : encoded}`;
        const expires = value === "" ? 1 : Number(args[2] ?? 0);
        if (expires) {
          cookie += `; Expires=${new Date(expires * 1000).toUTCString()}`;
          cookie += `; Max-Age=${Math.max(0, expires - Math.floor(Date.now() / 1000))}`;
        }
        if (path) cookie += `; Path=${path}`;
        if (domain) cookie += `; Domain=${domain}`;
        if (toBool(args[5] ?? false)) cookie += "; Secure";
        if (toBool(args[6] ?? false)) cookie += "; HttpOnly";
        this.headers.append("set-cookie", cookie);
        return true;
      }]
    ]);
  }

  private setStatus(status: number): void {
    if (!Number.isInteger(status) || status < 200 || status > 599) {
      throw new Error("Unsupported HTTP response status.");
    }
    this.status = status;
  }
}
