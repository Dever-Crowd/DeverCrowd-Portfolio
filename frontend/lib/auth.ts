export const STORAGE_TOKEN_KEY = "admin_token";

export function getAdminCookie(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function setAdminCookie(key: string , value: string | null): void {
  if (typeof window === "undefined") return;
  if (value) localStorage.setItem(key, value);
  else localStorage.removeItem(key);
}

export function clearAdminCookie(key: string): void {
  setAdminCookie(key, null);
}