type UUID = string;
import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface Sender {
  id: UUID;
  name: string;
  description?: string;
  [key: string]: unknown;
}

const RESOURCE = "/sender";

export async function getSenders(): Promise<Sender[]> {
  const res = await apiRequest<ApiEnvelope<Sender[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getSenderById(id: UUID): Promise<Sender | null> {
  const res = await apiRequest<ApiEnvelope<Sender>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as Sender) ?? null;
}

export async function createSender(payload: {
  name: string;
  description?: string;
}): Promise<Sender> {
  const res = await apiRequest<ApiEnvelope<Sender>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function updateSender(
  id: UUID,
  payload: Partial<Pick<Sender, "name" | "description">>
): Promise<Sender> {
  const res = await apiRequest<ApiEnvelope<Sender>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function deleteSender(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}

export async function deleteSenders(ids: UUID[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteSender(id)));
}
