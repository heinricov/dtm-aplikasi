type UUID = string;
import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface Vendor {
  id: UUID;
  title: string;
  name: string;
  description?: string;
  [key: string]: unknown;
}

const RESOURCE = "/vendor";

export async function getVendors(): Promise<Vendor[]> {
  const res = await apiRequest<ApiEnvelope<Vendor[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getVendorById(id: UUID): Promise<Vendor | null> {
  const res = await apiRequest<ApiEnvelope<Vendor>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as Vendor) ?? null;
}

export async function createVendor(payload: {
  title: string;
  name: string;
  description?: string;
}): Promise<Vendor> {
  const res = await apiRequest<ApiEnvelope<Vendor>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function updateVendor(
  id: UUID,
  payload: Partial<Pick<Vendor, "title" | "name" | "description">>
): Promise<Vendor> {
  const res = await apiRequest<ApiEnvelope<Vendor>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function deleteVendor(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}

export async function deleteVendors(ids: UUID[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteVendor(id)));
}
