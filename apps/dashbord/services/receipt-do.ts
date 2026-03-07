type UUID = string;

import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface ReceiptDo {
  id: UUID;
  incoming_document_id: UUID;
  silo_id: UUID;
  vendor_id: UUID;
  no_do: string;
  no_pid: string;
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
  vendor?: { id: UUID; name?: string | null; title?: string | null };
}

const RESOURCE = "/receipt-do";

export async function getReceiptDos(): Promise<ReceiptDo[]> {
  const res = await apiRequest<ApiEnvelope<ReceiptDo[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getReceiptDoById(id: UUID): Promise<ReceiptDo | null> {
  const res = await apiRequest<ApiEnvelope<ReceiptDo>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as ReceiptDo) ?? null;
}

export async function createReceiptDo(payload: {
  incoming_document_id: UUID;
  silo_id: UUID;
  vendor_id: UUID;
  no_do: string;
  no_pid: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}): Promise<ReceiptDo> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptDo>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return res.data;
}

export async function updateReceiptDo(
  id: UUID,
  payload: Partial<{
    incoming_document_id: UUID;
    silo_id: UUID;
    vendor_id: UUID;
    no_do: string;
    no_pid: string;
    scan_date: string | Date;
    upload_date: string | Date;
    description: string;
  }>
): Promise<ReceiptDo> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptDo>>(
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

export async function deleteReceiptDo(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
