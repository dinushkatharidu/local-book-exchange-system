import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requestBorrow, approveBorrow, markBorrowed, markReturned, myBorrows } from '../controllers/borrow.controller.js';
const r = Router();


r.get('/me', requireAuth, myBorrows);
r.post('/request', requireAuth, requestBorrow);
r.post('/:id/approve', requireAuth, approveBorrow);
r.post('/:id/borrowed', requireAuth, markBorrowed);
r.post('/:id/returned', requireAuth, markReturned);
export default r;