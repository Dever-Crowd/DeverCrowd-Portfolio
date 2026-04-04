import { getAdminCookie, STORAGE_TOKEN_KEY } from "@/lib/auth";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface ApiResponse<T = unknown> {
  ok: boolean;
  status?: number;
  data?: T | null;
  message?: string;
  error?: string;
}

function joinUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl.replace(/\/$/, "")}${p}`;
}

function mergeHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const h = { ...headers };
  if (typeof window !== "undefined") {
    const t = getAdminCookie(STORAGE_TOKEN_KEY);
    if (t && !h.Authorization) {
      h.Authorization = t;
    }
  }
  return h;
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export const get = async <T = unknown>(
  url: string,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(joinUrl(url), {
      method: "GET",
      headers: mergeHeaders(headers),
    });
    const data = await parseJsonSafe(res) as Record<string, unknown> | null;
    return {
      ok: res.ok,
      status: res.status,
      data: (data?.data as T) || null,
      message: (data?.message as string) || "",
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
};

export const post = async <T = unknown>(
  url: string,
  body: unknown,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const isFormData = body instanceof FormData;
    const res = await fetch(joinUrl(url), {
      method: "POST",
      headers: isFormData
        ? mergeHeaders(headers)
        : { "Content-Type": "application/json", ...mergeHeaders(headers) },
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await parseJsonSafe(res) as Record<string, unknown> | null;
    return {
      ok: res.ok,
      status: res.status,
      data: data?.data as T,
      message: (data?.message as string) || "",
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
};

export const put = async <T = unknown>(
  url: string,
  body: unknown,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const isFormData = body instanceof FormData;
    const res = await fetch(joinUrl(url), {
      method: "PATCH",
      headers: isFormData
        ? mergeHeaders(headers)
        : { "Content-Type": "application/json", ...mergeHeaders(headers) },
      body: isFormData ? body : JSON.stringify(body),
    });
    const data = await parseJsonSafe(res) as Record<string, unknown> | null;
    return {
      ok: res.ok,
      status: res.status,
      data: data as T,
      message: (data?.message as string) || "",
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
};

export const del = async <T = unknown>(
  url: string,
  headers: Record<string, string> = {}
): Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(joinUrl(url), {
      method: "DELETE",
      headers: mergeHeaders(headers),
    });
    const data = await parseJsonSafe(res) as Record<string, unknown> | null;
    return {
      ok: res.ok,
      status: res.status,
      data: data as T,
      message: (data?.message as string) || "",
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unexpected error" };
  }
};