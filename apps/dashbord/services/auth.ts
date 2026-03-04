import { apiRequest, type ApiEnvelope } from "../lib/api";

export interface LoginResponse {
  token: string;
  expiresIn: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string | null;
    created_at: string;
    updated_at: string;
  };
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await apiRequest<ApiEnvelope<LoginResponse>>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function forgotPassword(payload: {
  email: string;
}): Promise<{ requested: boolean; exists: boolean }> {
  const res = await apiRequest<
    ApiEnvelope<{ requested: boolean; exists: boolean }>
  >("/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiRequest<ApiEnvelope<{ success: true }>>("/auth/logout", {
    method: "POST"
  });
}
