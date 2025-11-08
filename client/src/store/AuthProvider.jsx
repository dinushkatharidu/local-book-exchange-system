// src/store/AuthProvider.jsx
import { useEffect, useState, useCallback } from "react";
import { api, isAuthMissing } from "../api/client";
import { AuthCtx } from "./auth-context";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // --- mock store helpers (used only if /api/auth/* is missing on server) ---
  const mockKey = "lbx_mock_user";
  const loadMock = () => {
    const raw = localStorage.getItem(mockKey);
    return raw ? JSON.parse(raw) : null;
  };
  const saveMock = (u) => localStorage.setItem(mockKey, JSON.stringify(u));
  const clearMock = () => localStorage.removeItem(mockKey);

  const signUp = async ({ name, email, password, city }) => {
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
        role: "user",
        city,
      });
      setUser(data);
      return data;
    } catch (err) {
      if (isAuthMissing(err)) {
        const mock = { id: "mock-" + Date.now(), name, email, role: "user" };
        saveMock(mock);
        setUser(mock);
        return mock;
      }
      throw err;
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setUser(data);
      return data;
    } catch (err) {
      if (isAuthMissing(err)) {
        const mock = loadMock();
        if (mock && mock.email === email) {
          setUser(mock);
          return mock;
        }
        const e = new Error(
          "Mock sign-in failed: no local account. Please sign up first."
        );
        e.response = { data: { message: e.message } };
        throw e;
      }
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore if backend route is missing
    }
    clearMock();
    setUser(null);
  };

  const loadMe = useCallback(async () => {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data);
    } catch (err) {
      if (isAuthMissing(err)) {
        setUser(loadMock());
        return;
      }
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const value = { user, signIn, signUp, signOut, loadMe };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
