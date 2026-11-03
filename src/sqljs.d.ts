declare module "sql.js/dist/sql-wasm-browser.js" {
  export interface SqlJsConnection {
    exec(sql: string, params?: readonly (string | number | null)[]): Array<{ columns: string[]; values: Array<Array<string | number | null>> }>;
    close(): void;
  }
  export default function initSqlJs(config?: {
    wasmBinary?: Uint8Array;
    instantiateWasm?: (imports: WebAssembly.Imports, receive: (instance: WebAssembly.Instance) => void) => WebAssembly.Exports;
  }): Promise<{ Database: new () => SqlJsConnection }>;
}
declare module "*.wasm" { const module: WebAssembly.Module; export default module; }
