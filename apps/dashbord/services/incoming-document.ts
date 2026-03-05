type UUID = string;

import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface IncomingDocument {
  id: UUID;
  user_id: UUID;
  document_receipt_date: string; // ISO date string (YYYY-MM-DD or ISO 8601)
  title?: string | null;
  document_type_id: UUID;
  sender_id: UUID;
  qty?: number | null;
  note?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
  user?: { id: UUID; name: string; email: string };
  document_type?: { id: UUID; title: string };
  sender?: { id: UUID; name: string };
}

const RESOURCE = "/incoming-document";

export async function getIncomingDocuments(): Promise<IncomingDocument[]> {
  const res = await apiRequest<ApiEnvelope<IncomingDocument[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getIncomingDocumentById(
  id: UUID
): Promise<IncomingDocument | null> {
  const res = await apiRequest<ApiEnvelope<IncomingDocument>>(
    `${RESOURCE}/${id}`,
    {
      method: "GET"
    }
  );
  return (res.data as IncomingDocument) ?? null;
}

export async function createIncomingDocument(payload: {
  user_id: UUID;
  document_receipt_date: string | Date;
  title?: string;
  document_type_id: UUID;
  sender_id: UUID;
  qty?: number;
  note?: string;
  description?: string;
}): Promise<IncomingDocument> {
  const body =
    payload?.document_receipt_date instanceof Date
      ? {
          ...payload,
          document_receipt_date: payload.document_receipt_date.toISOString()
        }
      : payload;
  const res = await apiRequest<ApiEnvelope<IncomingDocument>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return res.data;
}

export async function updateIncomingDocument(
  id: UUID,
  payload: Partial<{
    user_id: UUID;
    document_receipt_date: string | Date;
    title: string;
    document_type_id: UUID;
    sender_id: UUID;
    qty: number;
    note: string;
    description: string;
  }>
): Promise<IncomingDocument> {
  const toSend =
    payload?.document_receipt_date instanceof Date
      ? {
          ...payload,
          document_receipt_date: payload.document_receipt_date.toISOString()
        }
      : payload;
  const res = await apiRequest<ApiEnvelope<IncomingDocument>>(
    `${RESOURCE}/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(toSend)
    }
  );
  return res.data;
}

export async function deleteIncomingDocument(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
