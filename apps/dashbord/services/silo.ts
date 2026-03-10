type UUID = string;
import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface Silo {
  id: UUID;
  title: string;
  description?: string;
  [key: string]: unknown;
}

const RESOURCE = "/silo";

export async function getSilos(): Promise<Silo[]> {
  const res = await apiRequest<ApiEnvelope<Silo[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getSiloById(id: UUID): Promise<Silo | null> {
  const res = await apiRequest<ApiEnvelope<Silo>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as Silo) ?? null;
}

export async function createSilo(payload: {
  title: string;
  description?: string;
}): Promise<Silo> {
  const res = await apiRequest<ApiEnvelope<Silo>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function updateSilo(
  id: UUID,
  payload: Partial<Pick<Silo, "title" | "description">>
): Promise<Silo> {
  const res = await apiRequest<ApiEnvelope<Silo>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function deleteSilo(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}

export async function deleteSilos(ids: UUID[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteSilo(id)));
}
