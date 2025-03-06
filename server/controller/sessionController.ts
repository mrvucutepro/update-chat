import { Request, Response } from 'express';
import Session from '../models/Session';
import SessionCounselor from '../models/SessionCounselor';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
    user?: IUser;
}

// Create new session (User mở chat → Tạo session mới)
export const createSession = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        // Only users can create sessions
        if (req.user.role !== 'user') {
            res.status(403).json({ message: 'Only users can create sessions' });
            return;
        }

        // Check if user already has an active session
        const existingSession = await Session.findOne({
            user_id: req.user._id,
            is_active: true,
        });

        if (existingSession) {
            res.status(400).json({
                message: 'You already have an active session',
                session: existingSession,
            });
            return;
        }

        const session = await Session.create({
            user_id: req.user._id,
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as any).message,
        });
    }
};

// Get user's active session
export const getUserSession = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const session = await Session.findOne({
            user_id: req.user._id,
            is_active: true,
        });

        if (!session) {
            res.status(404).json({ message: 'No active session found' });
            return;
        }

        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as any).message,
        });
    }
};

// Join session as counselor (Counselor tham gia → Thêm vào session_counselors)
export const joinSession = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        // Only counselors can join sessions
        if (req.user.role !== 'counselor') {
            res.status(403).json({
                message: 'Only counselors can join sessions',
            });
            return;
        }

        const { sessionId } = req.params;

        // Check if session exists and is active
        const session = await Session.findOne({
            _id: sessionId,
            is_active: true,
        });

        if (!session) {
            res.status(404).json({ message: 'Session not found or inactive' });
            return;
        }

        // Check if counselor already joined this session
        const existingJoin = await SessionCounselor.findOne({
            session_id: sessionId,
            counselor_id: req.user._id,
        });

        if (existingJoin) {
            res.status(400).json({
                message: 'You have already joined this session',
            });
            return;
        }

        const sessionCounselor = await SessionCounselor.create({
            session_id: sessionId,
            counselor_id: req.user._id,
        });

        res.status(201).json(sessionCounselor);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as any).message,
        });
    }
};

// Get all active sessions (for counselors)
export const getActiveSessions = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        // Only counselors can see all active sessions
        if (req.user.role !== 'counselor') {
            res.status(403).json({ message: 'Not authorized' });
            return;
        }

        const sessions = await Session.find({ is_active: true }).populate(
            'user_id',
            'username'
        );

        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as any).message,
        });
    }
};

// Close session (User rời khỏi → Session có thể đóng)
export const closeSession = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        const { sessionId } = req.params;

        // Get the session
        const session = await Session.findById(sessionId);

        if (!session) {
            res.status(404).json({ message: 'Session not found' });
            return;
        }

        // Check if user is authorized to close this session
        if (
            req.user.role === 'user' &&
            session.user_id.toString() !== req.user._id.toString()
        ) {
            res.status(403).json({
                message: 'Not authorized to close this session',
            });
            return;
        }

        if (req.user.role === 'counselor') {
            // Check if counselor is part of this session
            const isCounselor = await SessionCounselor.findOne({
                session_id: sessionId,
                counselor_id: req.user._id,
            });

            if (!isCounselor) {
                res.status(403).json({
                    message: 'Not authorized to close this session',
                });
                return;
            }
        }

        // Update session to inactive
        session.is_active = false;
        await session.save();

        res.status(200).json({ message: 'Session closed successfully' });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            error: (error as any).message,
        });
    }
};
