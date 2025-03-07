import { Request, Response } from 'express';
import Session from '../models/Session';
import SessionCounselor from '../models/SessionCounselor';

export const createSession = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body;
        if (!user_id) {
            res.status(400).json({ message: 'user_id is required' });
            return;
        }
        const session = new Session({ user_id });
        await session.save();
        res.status(201).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error creating session', error });
    }
};

export const joinSession = async (req: Request, res: Response) => {
    try {
        const { session_id, counselor_id } = req.body;
        const session = await Session.findById(session_id);
        // if (!session || session.is_active !== true) {
        //     res.status(404).json({ message: 'Session not found or closed' });
        //     return;
        // }
        if (!session || session.status !== 'active') {
            res.status(404).json({ message: 'Session not found or closed' });
            return;
        }
        const sessionCounselor = new SessionCounselor({
            session_id,
            counselor_id,
        });
        await sessionCounselor.save();
        res.status(201).json(sessionCounselor);
    } catch (error) {
        res.status(500).json({ message: 'Error joining session', error });
    }
};

export const getActiveSessionByUser = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.params;

        // Kiểm tra session đang hoạt động của user
        const session = await Session.findOne({
            user_id,
            status: 'active',
        }).populate('user_id', 'username');
        if (!session) {
            res.status(404).json({ message: 'No active session found' });
            return;
        }

        res.status(200).json(session);
    } catch (error) {
        console.error('Error fetching active session:', error);
        res.status(500).json({
            message: 'Error fetching active session',
            error,
        });
    }
};
// export const getActiveSessions = async (req: Request, res: Response) => {
//     try {
//         const { user_id } = req.params;

//         // Lấy danh sách các session đang hoạt động
//         const activeSessions = await Session.findOne({
//             user_id,
//             status: 'active',
//         }).populate('user_id', 'username');
//         res.status(200).json(activeSessions);
//     } catch (error) {
//         console.error('Error fetching active sessions:', error);
//         res.status(500).json({
//             message: 'Error fetching active sessions',
//             error,
//         });
//     }
// };
export const getActiveSessions = async (req: Request, res: Response) => {
    try {
        // Lấy danh sách các session đang hoạt động
        const activeSessions = await Session.find({
            status: 'active',
        }).populate('user_id', 'username');
        res.status(200).json(activeSessions);
    } catch (error) {
        console.error('Error fetching active sessions:', error);
        res.status(500).json({
            message: 'Error fetching active sessions',
            error,
        });
    }
};
