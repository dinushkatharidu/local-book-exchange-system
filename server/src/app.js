import express from "express";
import cors from "cors";
// (optional) only if you ever read cookies in auth middleware
// import cookieParser from "cookie-parser";

import bookRoutes from "./routes/book.routes.js";
import authRoutes from "./routes/auth.routes.js"; // <-- make sure this exists and exports default

const app = express();

app.use(express.json());
// app.use(cookieParser()); // enable if your middleware reads req.cookies

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:5173"],
    credentials: true,
  })
);

// simple health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// MOUNT YOUR ROUTES (order doesn’t matter)
app.use("/api/auth", authRoutes);     // <-- THIS is what enables /api/auth/*
app.use("/api/books", bookRoutes);

export default app; // keep default export
