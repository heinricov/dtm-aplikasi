type UUID = string;
import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface User {
  id: UUID;
  name: string;
  email: string;
  role?: string | null;
  [key: string]: unknown;
}

const RESOURCE = "/user";

export async function getUsers(): Promise<User[]> {
  const res = await apiRequest<ApiEnvelope<User[]>>(RESOURCE, {
    method: "GET"
  });
  return res.data ?? [];
}

export async function getUserById(id: UUID): Promise<User | null> {
  const res = await apiRequest<ApiEnvelope<User>>(`${RESOURCE}/${id}`, {
    method: "GET"
  });
  return (res.data as User) ?? null;
}

export async function createUser(payload: {
  name: string;
  email: string;
  password: string;
  role?: string | null;
}): Promise<User> {
  const res = await apiRequest<ApiEnvelope<User>>(RESOURCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function updateUser(
  id: UUID,
  payload: Partial<{
    name: string;
    email: string;
    password: string;
    role: string | null;
  }>
): Promise<User> {
  const res = await apiRequest<ApiEnvelope<User>>(`${RESOURCE}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function deleteUser(id: UUID): Promise<void> {
  await apiRequest<ApiEnvelope<Record<string, never>>>(`${RESOURCE}/${id}`, {
    method: "DELETE"
  });
}

export async function deleteUsers(ids: UUID[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteUser(id)));
}
