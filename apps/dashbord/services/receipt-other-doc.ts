type UUID = string;

import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface ReceiptOtherDoc {
  id: UUID;
  incoming_document_id: UUID;
  no_document: string;
  scan_date?: string | null;
  upload_date?: string | null;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
  incoming_document?: {
    id: UUID;
    title?: string | null;
    document_receipt_date?: string;
  };
}

const RESOURCE = "/receipt-other-doc";

export async function getReceiptOtherDocs(): Promise<ReceiptOtherDoc[]> {
  const res = await apiRequest<ApiEnvelope<ReceiptOtherDoc[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getReceiptOtherDocById(
  id: UUID
): Promise<ReceiptOtherDoc | null> {
  const res = await apiRequest<ApiEnvelope<ReceiptOtherDoc>>(
    `${RESOURCE}/${id}`,
    {
      method: "GET"
    }
  );
  return (res.data as ReceiptOtherDoc) ?? null;
}

export async function createReceiptOtherDoc(payload: {
  incoming_document_id: UUID;
  no_document: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}): Promise<ReceiptOtherDoc> {
  const body = {
    ...payload,
    scan_date:
      payload.scan_date instanceof Date
        ? payload.scan_date.toISOString()
        : payload.scan_date,
    upload_date:
      payload.upload_date instanceof Date
        ? payload.upload_date.toISOString()
        : payload.upload_date
  };
  const res = await apiRequest<ApiEnvelope<ReceiptOtherDoc>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return res.data;
}

export async function updateReceiptOtherDoc(
  id: UUID,
  payload: Partial<{
    incoming_document_id: UUID;
    no_document: string;
    scan_date: string | Date;
    upload_date: string | Date;
    description: string;
  }>
): Promise<ReceiptOtherDoc> {
  const toSend = {
    ...payload,
    scan_date:
      payload?.scan_date instanceof Date
        ? payload.scan_date.toISOString()
        : payload.scan_date,
    upload_date:
      payload?.upload_date instanceof Date
        ? payload.upload_date.toISOString()
        : payload.upload_date
  };
  const res = await apiRequest<ApiEnvelope<ReceiptOtherDoc>>(
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

export async function deleteReceiptOtherDoc(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
