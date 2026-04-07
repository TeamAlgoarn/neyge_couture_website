import axios from "axios";
import { adminAuth } from "./adminAuth";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
});

adminApi.interceptors.request.use((config) => {
  const token = adminAuth.getToken();

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default adminApi;