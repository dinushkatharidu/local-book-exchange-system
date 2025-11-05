import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createBook, myBooks, updateBook, deleteBook, listPublic, getBook } from '../controllers/book.controller.js';
const r = Router();


r.get('/', listPublic); 
r.get('/:id', getBook); 
r.get('/me/list', requireAuth, myBooks);
r.post('/', requireAuth, createBook);
r.patch('/:id', requireAuth, updateBook);
r.delete('/:id', requireAuth, deleteBook);
export default r;