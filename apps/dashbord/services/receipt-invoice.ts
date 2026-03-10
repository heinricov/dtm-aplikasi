type UUID = string;

import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface ReceiptInvoice {
  id: UUID;
  incoming_document_id: UUID;
  silo_id: UUID;
  vendor_id: UUID;
  no_invoice?: string | null;
  no_po?: string | null;
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

const RESOURCE = "/receipt-invoice";

export async function getReceiptInvoices(): Promise<ReceiptInvoice[]> {
  const res = await apiRequest<ApiEnvelope<ReceiptInvoice[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getReceiptInvoiceById(
  id: UUID
): Promise<ReceiptInvoice | null> {
  const res = await apiRequest<ApiEnvelope<ReceiptInvoice>>(
    `${RESOURCE}/${id}`,
    {
      method: "GET"
    }
  );
  return (res.data as ReceiptInvoice) ?? null;
}

export async function createReceiptInvoice(payload: {
  incoming_document_id: UUID;
  silo_id: UUID;
  vendor_id: UUID;
  no_invoice?: string;
  no_po?: string;
  scan_date?: string | Date;
  upload_date?: string | Date;
  description?: string;
}): Promise<ReceiptInvoice> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptInvoice>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  return res.data;
}

export async function updateReceiptInvoice(
  id: UUID,
  payload: Partial<{
    incoming_document_id: UUID;
    silo_id: UUID;
    vendor_id: UUID;
    no_invoice: string;
    no_po: string;
    scan_date: string | Date;
    upload_date: string | Date;
    description: string;
  }>
): Promise<ReceiptInvoice> {
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
  const res = await apiRequest<ApiEnvelope<ReceiptInvoice>>(
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

export async function deleteReceiptInvoice(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}

export async function deleteReceiptInvoices(ids: UUID[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteReceiptInvoice(id)));
}
