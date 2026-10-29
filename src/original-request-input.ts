/** include/global.func.php gstrfilter(), with magic_quotes_gpc=false. */
export function originalInputFilter(value: string): string {
  return value.replace(/['\\]/g, '')
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/___/g, '');
}
export function originalFormInput(form: URLSearchParams): URLSearchParams {
  const result = new URLSearchParams();
  // PHP uses the last occurrence of a scalar form key.
  for (const [key, value] of form) result.set(key, originalInputFilter(value));
  return result;
}
