type UUID = string;

export interface Bank {
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

const RESOURCE = `${API_BASE}/bank`;

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

export async function getBanks(): Promise<Bank[]> {
  const res = await request<ApiEnvelope<Bank[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getBankById(id: UUID): Promise<Bank | null> {
  const res = await request<ApiEnvelope<Bank>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as Bank) ?? null;
}

export async function createBank(payload: {
  title: string;
  description?: string;
}): Promise<Bank> {
  const res = await request<ApiEnvelope<Bank>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function updateBank(
  id: UUID,
  payload: Partial<Pick<Bank, "title" | "description">>
): Promise<Bank> {
  const res = await request<ApiEnvelope<Bank>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function deleteBank(id: UUID): Promise<void> {
  await request<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
