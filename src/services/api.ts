// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/vietvivu";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
