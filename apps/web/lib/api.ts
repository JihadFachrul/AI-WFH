import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Axios singleton — satu-satunya HTTP client untuk seluruh app.
 * - baseURL dari env (NEXT_PUBLIC_API_URL)
 * - interceptor request: auto-attach Bearer token dari auth store
 * - interceptor response: 401 -> logout + redirect ke /login
 */
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      useAuthStore.getState().logout();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
