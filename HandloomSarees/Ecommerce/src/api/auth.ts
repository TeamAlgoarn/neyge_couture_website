import api from "./client";
import { tokenStorage } from "../lib/token";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const res = await api.post("/auth/login", payload);
  const token = res.data?.data?.access_token;

  if (token) {
    tokenStorage.set(token);
  }

  return res.data;
}

export async function register(payload: RegisterPayload) {
  const res = await api.post("/auth/register", payload);
  const token = res.data?.data?.access_token;

  if (token) {
    tokenStorage.set(token);
  }

  return res.data;
}

export async function getMe() {
  const res = await api.get("/auth/me");
  return res.data;
}

export function logout() {
  tokenStorage.remove();
}