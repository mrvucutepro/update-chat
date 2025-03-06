import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { getMessages, sendMessage } from '../services/messageService';

const router = express.Router();
router.get('/:userId', authMiddleware(['admin']), getMessages);
router.post('/', authMiddleware(['user', 'admin']), sendMessage);
export default router;
