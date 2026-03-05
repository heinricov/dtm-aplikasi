// Fungsi-fungsi pemanggil API untuk resource Document Type
// Catatan: Basis URL dapat dikonfigurasi dengan env NEXT_PUBLIC_API_BASE_URL,
// fallback ke http://localhost:6000 sesuai kebutuhan lokal.

type UUID = string;
import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface DocumentType {
  id: UUID;
  title: string;
  description?: string;
  [key: string]: unknown;
}

const RESOURCE = "/document-type";

// Mengambil seluruh data Document Type
export async function getDocumentTypes(): Promise<DocumentType[]> {
  const res = await apiRequest<ApiEnvelope<DocumentType[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

// Mengambil satu data Document Type berdasarkan ID
export async function getDocumentTypeById(
  id: UUID
): Promise<DocumentType | null> {
  const res = await apiRequest<ApiEnvelope<DocumentType>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as DocumentType) ?? null;
}

// Membuat Document Type baru
export async function createDocumentType(payload: {
  title: string;
  description?: string;
}): Promise<DocumentType> {
  const res = await apiRequest<ApiEnvelope<DocumentType>>(RESOURCE, {
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
  const res = await apiRequest<ApiEnvelope<DocumentType>>(`${RESOURCE}/${id}`, {
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
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
