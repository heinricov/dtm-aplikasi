type UUID = string;

import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface ReceiptVp {
  id: UUID;
  incoming_document_id: UUID;
  silo_id: UUID;
  bank_id: UUID;
  month: number;
  year: number;
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
  silo?: { id: UUID; title?: string | null };
  bank?: { id: UUID; title?: string | null };
}

const RESOURCE = "/receipt-vp";

export async function getReceiptVps(): Promise<ReceiptVp[]> {
  const res = await apiRequest<ApiEnvelope<ReceiptVp[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getReceiptVpById(id: UUID): Promise<ReceiptVp | null> {
  const res = await apiRequest<ApiEnvelope<ReceiptVp>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as ReceiptVp) ?? null;
}

export async function createReceiptVp(payload: {
  incoming_document_id: UUID;
  silo_id: UUID;
  bank_id: UUID;
  month: number;
  year: number;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}): Promise<ReceiptVp> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptVp>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return res.data;
}

export async function updateReceiptVp(
  id: UUID,
  payload: Partial<{
    incoming_document_id: UUID;
    silo_id: UUID;
    bank_id: UUID;
    month: number;
    year: number;
    scan_date: string | Date;
    upload_date: string | Date;
    description: string;
  }>
): Promise<ReceiptVp> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptVp>>(
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

export async function deleteReceiptVp(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
