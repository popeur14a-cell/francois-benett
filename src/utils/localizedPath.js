export function getLocalizedPath(path, english = false) {
  if (!english || !path?.startsWith("/") || path === "/en" || path.startsWith("/en/")) {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}
