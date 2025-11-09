import { Router } from 'express';
import { listBooks, createBook } from '../controllers/book.controller.js';

const router = Router();

router.get('/', listBooks);
router.post('/', createBook);

export default router;
