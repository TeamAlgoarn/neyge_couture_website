import axios from "axios";
import { API_BASE_URL } from "@/config/env";

function getUserToken(): string | null {
  const keys = [
    "access_token",
    "token",
    "user_access_token",
    "auth_token",
    "user_token",
  ];

  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value && value.trim()) return value;
  }

  return null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getUserToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
