import axios from "axios";
import { adminAuth } from "./adminAuth";
import { API_BASE_URL } from "@/config/env";

const adminApi = axios.create({
  baseURL: API_BASE_URL,
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
