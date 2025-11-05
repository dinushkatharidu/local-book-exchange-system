import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { startConversation, sendMessage, getConversation, myConversations } from '../controllers/message.controller.js';
const r = Router();


r.get('/me', requireAuth, myConversations);
r.get('/:id', requireAuth, getConversation);
r.post('/start', requireAuth, startConversation);
r.post('/send', requireAuth, sendMessage);
export default r;