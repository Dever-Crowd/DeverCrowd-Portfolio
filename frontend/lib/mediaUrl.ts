export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  const p = String(path);

  if (p.startsWith("/") && !p.includes("uploads")) {
    return p;
  }

  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  const cleanBase = base.replace(/\/$/, "");
  const cleanPath = p.replace(/^\//, "");
  return `${cleanBase}/${cleanPath}`;
}