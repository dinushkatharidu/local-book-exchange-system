import { Router } from 'express';
import { listBooks, getBookById, createBook, updateBook, deleteBook, getMyBooks } from '../controllers/book.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', listBooks);
router.get('/me/list', authRequired, getMyBooks);
router.get('/:id', getBookById);
router.post('/', authRequired, createBook);
router.put('/:id', authRequired, updateBook);
router.delete('/:id', authRequired, deleteBook);

export default router;
