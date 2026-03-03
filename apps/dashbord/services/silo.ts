type UUID = string;

export interface Silo {
  id: UUID;
  title: string;
  description?: string;
  [key: string]: unknown;
}

interface ApiEnvelope<T> {
  status: boolean;
  code: number;
  message: string;
  data: T;
  qty?: number;
}

const isServer = typeof window === "undefined";
const API_BASE =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ||
      (isServer ? process.env.API_BASE_URL?.trim() : undefined))) ||
  "http://127.0.0.1:4000";

const RESOURCE = `${API_BASE}/silo`;

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    cache: "no-store",
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
}

export async function getSilos(): Promise<Silo[]> {
  const res = await request<ApiEnvelope<Silo[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getSiloById(id: UUID): Promise<Silo | null> {
  const res = await request<ApiEnvelope<Silo>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as Silo) ?? null;
}

export async function createSilo(payload: {
  title: string;
  description?: string;
}): Promise<Silo> {
  const res = await request<ApiEnvelope<Silo>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function updateSilo(
  id: UUID,
  payload: Partial<Pick<Silo, "title" | "description">>
): Promise<Silo> {
  const res = await request<ApiEnvelope<Silo>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function deleteSilo(id: UUID): Promise<void> {
  await request<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}

