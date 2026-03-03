// Fungsi-fungsi pemanggil API untuk resource Document Type
// Catatan: Basis URL dapat dikonfigurasi dengan env NEXT_PUBLIC_API_BASE_URL,
// fallback ke http://localhost:6000 sesuai kebutuhan lokal.

type UUID = string;

export interface DocumentType {
  id: UUID;
  title: string;
  description?: string;
  // Field lain (createdAt, updatedAt, dsb) akan tetap didukung secara dinamis
  // tanpa dipaksakan di tipe ini.
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

const RESOURCE = `${API_BASE}/document-type`;

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

// Mengambil seluruh data Document Type
export async function getDocumentTypes(): Promise<DocumentType[]> {
  const res = await request<ApiEnvelope<DocumentType[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

// Mengambil satu data Document Type berdasarkan ID
export async function getDocumentTypeById(
  id: UUID
): Promise<DocumentType | null> {
  const res = await request<ApiEnvelope<DocumentType>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as DocumentType) ?? null;
}

// Membuat Document Type baru
export async function createDocumentType(payload: {
  title: string;
  description?: string;
}): Promise<DocumentType> {
  const res = await request<ApiEnvelope<DocumentType>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

// Memperbarui Document Type berdasarkan ID
export async function updateDocumentType(
  id: UUID,
  payload: Partial<Pick<DocumentType, "title" | "description">>
): Promise<DocumentType> {
  const res = await request<ApiEnvelope<DocumentType>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

// Menghapus Document Type berdasarkan ID
export async function deleteDocumentType(id: UUID): Promise<void> {
  await request<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
