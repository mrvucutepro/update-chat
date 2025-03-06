import { Request, Response } from 'express';
import Message from '../models/Message';
import Session from '../models/Session';
import SessionCounselor from '../models/SessionCounselor';

// 3. Gửi tin nhắn
export const sendMessage = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { session_id, sender_id, content, is_internal } = req.body;

        // Kiểm tra session đang hoạt động
        const session = await Session.findById(session_id);
        if (!session || !session.is_active) {
            res.status(400).json({ message: 'Session không hợp lệ' });
            return;
        }

        // Kiểm tra quyền gửi tin nhắn
        if (is_internal) {
            // Counselor mới được gửi tin nhắn nội bộ
            const counselor = await SessionCounselor.findOne({
                session_id,
                counselor_id: sender_id,
            });
            if (!counselor) {
                res.status(403).json({
                    message: 'Bạn không phải counselor trong session này',
                });
                return;
            }
        } else {
            // User hoặc counselor đều có thể gửi tin nhắn thông thường
            const isUser = session.user_id.toString() === sender_id;
            const isCounselor = await SessionCounselor.exists({
                session_id,
                counselor_id: sender_id,
            });
            if (!isUser && !isCounselor) {
                res.status(403).json({
                    message: 'Bạn không có quyền gửi tin nhắn',
                });
                return;
            }
        }

        // Lưu tin nhắn
        const newMessage = new Message({
            session_id,
            sender_id,
            content,
            is_internal,
        });
        const savedMessage = await newMessage.save();

        // Cập nhật trạng thái "delivered" (tuỳ logic triển khai thực tế)
        await Message.findByIdAndUpdate(savedMessage._id, {
            message_status: 'delivered',
        });

        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// 4. Đánh dấu tin nhắn đã đọc
export const markMessageAsRead = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { message_id } = req.params;
        const message = await Message.findByIdAndUpdate(
            message_id,
            { message_status: 'read' },
            { new: true }
        );
        if (!message) {
            res.status(404).json({ message: 'Tin nhắn không tồn tại' });
            return;
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
