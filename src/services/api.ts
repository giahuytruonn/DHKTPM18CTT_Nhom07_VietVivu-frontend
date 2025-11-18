// src/services/api.ts
import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

const API_BASE =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080/vietvivu";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;



  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.warn("Token expired, removing...");
        useAuthStore.getState().logout();
        return config; 
      }
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Invalid token, logout...");
      useAuthStore.getState().logout();
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
