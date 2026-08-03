export function rubyString(value) {
  return JSON.stringify(value).replaceAll('#', '\\#');
}
