import express from 'express';
import { createSession, closeSession } from '../controller/sessionController';

const router = express.Router();

// Session
router.post('/sessions', createSession);
router.put('/sessions/end', closeSession);
export default router;
