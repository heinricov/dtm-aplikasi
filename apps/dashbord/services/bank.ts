type UUID = string;
import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface Bank {
  id: UUID;
  title: string;
  description?: string;
  [key: string]: unknown;
}

const RESOURCE = "/bank";

export async function getBanks(): Promise<Bank[]> {
  const res = await apiRequest<ApiEnvelope<Bank[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getBankById(id: UUID): Promise<Bank | null> {
  const res = await apiRequest<ApiEnvelope<Bank>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as Bank) ?? null;
}

export async function createBank(payload: {
  title: string;
  description?: string;
}): Promise<Bank> {
  const res = await apiRequest<ApiEnvelope<Bank>>(RESOURCE, {
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
  const res = await apiRequest<ApiEnvelope<Bank>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function deleteBank(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}
