// client/src/api/client.js
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true, // so real cookies will work later
});

// Helper to detect “backend auth missing” (404)
export function isAuthMissing(error) {
  const url = error?.config?.url || "";
  const isAuthPath = url.includes("/api/auth/");
  const status = error?.response?.status;
  return isAuthPath && (status === 404 || status === 501 || status === 405);
}
