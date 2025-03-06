import express from 'express';
import { createSession, closeSession } from '../controller/sessionController';
import {
    markMessageAsRead,
    sendMessage,
} from '../controller/messageController';
import { addCounselorToSession } from '../controller/sessionCounselorController';

const router = express.Router();

// Session
router.post('/sessions', createSession);
router.put('/sessions/end', closeSession);

// Counselor
router.post('/sessions/counselors', addCounselorToSession);

// Message
router.post('/messages', sendMessage);
router.put('/messages/:message_id/read', markMessageAsRead);

export default router;
