import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { getAllUsers, getProfile, updateProfile, deleteAccount } from '../controllers/user.controller.js';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getProfile);
router.put('/me', authRequired, updateProfile);
router.delete('/me', authRequired, deleteAccount);

export default router;
