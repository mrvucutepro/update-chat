import express from 'express';
import {
    adminLogin,
    getAllUsers,
    getAdmins,
    sendMessageByAdmin,
} from '../services/adminService';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/users', authMiddleware(['admin']), getAllUsers);
router.get('/admins', authMiddleware(['admin']), getAdmins);
router.post('/message', authMiddleware(['admin']), sendMessageByAdmin);

export default router;
