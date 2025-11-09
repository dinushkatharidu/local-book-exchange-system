import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  requestBorrow,
  approveBorrow,
  markBorrowed,
  markReturned,
  myBorrows,
} from "../controller/borrow.controller.js";

const r = Router();
r.get("/me", authRequired, myBorrows);
r.post("/request", authRequired, requestBorrow);
r.post("/:id/approve", authRequired, approveBorrow);
r.post("/:id/borrowed", authRequired, markBorrowed);
r.post("/:id/returned", authRequired, markReturned);
export default r;
