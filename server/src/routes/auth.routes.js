import { Router } from "express";
import { register, login, me, logout } from "../controllers/auth.controller.js"; // <-- plural 'controllers'
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, me);
router.post("/logout", authRequired, logout);

export default router; // default export is required by app.js
