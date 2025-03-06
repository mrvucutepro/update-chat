import express from 'express';
import { blockUser, unblockUser } from '../services/blockService';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();
router.post('/block', authMiddleware(['admin']), blockUser);
router.post('/unblock', authMiddleware(['admin']), unblockUser);
export default router;
