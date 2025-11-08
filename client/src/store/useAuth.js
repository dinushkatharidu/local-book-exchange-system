// src/store/useAuth.js
import { useContext } from "react";
import { AuthCtx } from "./auth-context";
export const useAuth = () => useContext(AuthCtx);
