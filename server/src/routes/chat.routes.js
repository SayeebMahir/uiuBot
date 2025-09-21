import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { sendMessage, getHistory } from '../controllers/chat.controller.js';

const router = Router();

router.get('/history', requireAuth, getHistory);
router.post('/send', requireAuth, sendMessage);

export default router;

