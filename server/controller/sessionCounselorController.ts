import { Request, Response } from 'express';
import SessionCounselor from '../models/SessionCounselor';
import Session from '../models/Session';
import User from '../models/User';

// 2. Counselor tham gia → Thêm vào session_counselors
export const addCounselorToSession = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { session_id, counselor_id } = req.body;

        // Kiểm tra session hợp lệ
        const session = await Session.findById(session_id);
        if (!session || !session.is_active) {
            res.status(400).json({
                message: 'Session không tồn tại hoặc đã đóng',
            });
            return;
        }

        // Kiểm tra counselor có vai trò phù hợp
        const counselor = await User.findById(counselor_id);
        if (!counselor || counselor.role !== 'counselor') {
            res.status(403).json({ message: 'Counselor không hợp lệ' });
            return;
        }

        // Kiểm tra counselor đã tham gia session chưa
        const existingEntry = await SessionCounselor.findOne({
            session_id,
            counselor_id,
        });
        if (existingEntry) {
            res.status(400).json({
                message: 'Counselor đã tham gia session này',
            });
            return;
        }

        const newEntry = new SessionCounselor({ session_id, counselor_id });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
