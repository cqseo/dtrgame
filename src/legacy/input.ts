/** PHP gstrfilter() from include/global.func.php, including its legacy quirks. */
export function legacyStringFilter(value: string): string {
  return value
    .replaceAll("'", "")
    .replaceAll("\\", "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("___", "");
}

export function legacyInputRecord(input: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of input) {
    const filteredKey = legacyStringFilter(key);
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(filteredKey)) continue;
    result[filteredKey] = legacyStringFilter(value);
  }
  return result;
}
