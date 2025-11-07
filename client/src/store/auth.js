import { create } from "zustand";
import { api } from "../api/client";

export const useAuth = create((set) => ({
  user: null,
  async signUp(data) {
    const res = await api.post("/api/auth/register", data);
    set({ user: res.data });
  },
  async signIn(data) {
    const res = await api.post("/api/auth/login", data);
    set({ user: res.data });
  },
  async signOut() {
    await api.post("/api/auth/logout");
    set({ user: null });
  },
  async loadMe() {
    try {
      const res = await api.get("/api/auth/me");
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },
}));
