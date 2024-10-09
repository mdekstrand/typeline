export function dropUndefined(obj: Record<string, unknown>) {
  const keys = Object.keys(obj);
  for (let key of keys) {
    if (obj[key] === undefined) {
      delete obj[key];
    } else if (obj[key] && typeof obj[key] == "object") {
      dropUndefined(obj[key] as Record<string, unknown>);
    }
  }
}
