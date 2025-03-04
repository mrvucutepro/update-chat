import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getProfile, login } from '../controller/authController';

const router = express.Router();

router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);

export default router;
