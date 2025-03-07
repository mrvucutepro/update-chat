import express from 'express';
import {
    getCounselors,
    getProfile,
    getUsers,
    login,
    register,
} from '../controller/userController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import {
    closeSession,
    markMessageAsRead,
    sendMessage,
} from '../controller/messageController';
import {
    createSession,
    getActiveSessionByUser,
    getActiveSessions,
    joinSession,
} from '../controller/sessionController';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
// router.get('/protected-route', authorize(['counselor']), (req, res) => {
//     res.json({ message: 'You have access to this protected route' });
// });
router.use(authenticate); // Áp dụng middleware xác thực
router.get('/profile', getProfile);
router.get('/users', authorize(['admin']), getUsers);
router.get('/counselors', getCounselors);
router.post('/messages', sendMessage);
router.put('/messages/mark-read', markMessageAsRead);
router.post('/sessions', createSession);
router.get('/sessions/active', getActiveSessions);
router.get('/sessions/active/:user_id', getActiveSessionByUser);
router.post('/sessions/join', joinSession);
router.put('/sessions/close', closeSession);

export default router;
