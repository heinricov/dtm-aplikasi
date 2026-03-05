type Method = "GET" | "POST" | "PATCH" | "DELETE";

export const isServer = typeof window === "undefined";
export const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
      (isServer ? process.env.API_BASE_URL?.trim() : undefined))) ||
  "http://127.0.0.1:4000";

export interface ApiEnvelope<T> {
  status: boolean;
  code: number;
  message: string;
  data: T;
  qty?: number;
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit & { method?: Method }
): Promise<T> {
  const buildUrl = (base: string) =>
    path.startsWith("http") ? path : `${base}${path}`;
  const unique = (arr: string[]) => Array.from(new Set(arr));
  const candidates = unique([
    API_BASE,
    API_BASE.replace("127.0.0.1", "localhost"),
    API_BASE.replace("localhost", "127.0.0.1"),
    API_BASE.replace(":4001", ":4000"),
    API_BASE.replace(":4000", ":4001")
  ]).filter(Boolean);

  let lastErr: Error | null = null;
  for (const base of candidates) {
    try {
      const url = buildUrl(base);
      const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
        ...init
      });
      const isJson =
        res.headers.get("content-type")?.includes("application/json") ?? false;
      const body = isJson ? await res.json() : await res.text();
      if (!res.ok) {
        const message =
          (isJson && (body?.message as string | undefined)) ||
          res.statusText ||
          "Request failed";
        throw new Error(message);
      }
      return body as T;
    } catch (e) {
      lastErr = e as Error;
      // Coba kandidat base URL berikutnya
      continue;
    }
  }
  throw lastErr ?? new Error("Request failed");
}
