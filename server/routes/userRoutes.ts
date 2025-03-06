import express from 'express';
import {
    getUsers,
    getUserStatus,
    sendMessageToUser,
} from '../services/userService';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/users', authMiddleware(['admin']), getUsers);
router.get('/status/:userId', authMiddleware(['admin', 'user']), getUserStatus);
router.post('/message', authMiddleware(['user']), sendMessageToUser);

export default router;
