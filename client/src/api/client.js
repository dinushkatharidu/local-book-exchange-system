import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true, // 🔥 This is important for sending cookies (JWT)
});

export default api;
