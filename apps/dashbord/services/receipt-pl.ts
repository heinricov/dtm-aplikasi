type UUID = string;

import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface ReceiptPl {
  id: UUID;
  incoming_document_id: UUID;
  silo_id: UUID;
  no_pl: string;
  ship_ref: string;
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
}

const RESOURCE = "/receipt-pl";

export async function getReceiptPls(): Promise<ReceiptPl[]> {
  const res = await apiRequest<ApiEnvelope<ReceiptPl[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getReceiptPlById(id: UUID): Promise<ReceiptPl | null> {
  const res = await apiRequest<ApiEnvelope<ReceiptPl>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as ReceiptPl) ?? null;
}

export async function createReceiptPl(payload: {
  incoming_document_id: UUID;
  silo_id: UUID;
  no_pl: string;
  ship_ref: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}): Promise<ReceiptPl> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptPl>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return res.data;
}

export async function updateReceiptPl(
  id: UUID,
  payload: Partial<{
    incoming_document_id: UUID;
    silo_id: UUID;
    no_pl: string;
    ship_ref: string;
    scan_date: string | Date;
    upload_date: string | Date;
    description: string;
  }>
): Promise<ReceiptPl> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptPl>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(toSend)
  });
  return res.data;
}

export async function deleteReceiptPl(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}

export async function deleteReceiptPls(ids: UUID[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteReceiptPl(id)));
}
