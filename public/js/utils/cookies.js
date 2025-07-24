export function parseCookies() {
  return Object.fromEntries(
    document.cookie.split("; ").map((entry) => {
      const [key, value] = entry.split("=");
      return [key, decodeURIComponent(value)];
    }),
  );
}
