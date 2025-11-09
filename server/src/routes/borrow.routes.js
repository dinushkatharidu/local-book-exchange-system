import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  requestBorrow,
  approveBorrow,
  markBorrowed,
  markReturned,
  myBorrows,
  getBorrowById,
  cancelBorrow,
  rejectBorrow,
  updateBorrowDueDate,
} from "../controllers/borrow.controller.js";

const r = Router();
r.get("/me", authRequired, myBorrows);
r.get("/:id", authRequired, getBorrowById);
r.post("/request", authRequired, requestBorrow);
r.post("/:id/approve", authRequired, approveBorrow);
r.post("/:id/borrowed", authRequired, markBorrowed);
r.post("/:id/returned", authRequired, markReturned);
r.post("/:id/cancel", authRequired, cancelBorrow);
r.post("/:id/reject", authRequired, rejectBorrow);
r.put("/:id/due-date", authRequired, updateBorrowDueDate);
export default r;
