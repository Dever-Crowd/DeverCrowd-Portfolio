/**
 * Build URL for project/media images: API uploads vs Next.js public assets.
 */
export function mediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const p = String(path);
  // Next.js public folder (e.g. /projects/foo.webp)
  if (p.startsWith("/") && !p.includes("uploads")) {
    return p;
  }
  const base =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) || "http://localhost:3001";
  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = p.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
}
