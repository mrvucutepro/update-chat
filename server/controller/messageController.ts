import { Request, Response } from 'express';
import Message from '../models/Message';
import Session from '../models/Session';

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { session_id, sender_id, message, is_internal } = req.body;
        const newMessage = new Message({
            session_id,
            sender_id,
            message,
            is_internal,
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

export const markMessageAsRead = async (req: Request, res: Response) => {
    try {
        const { message_id } = req.body;
        const message = await Message.findByIdAndUpdate(
            message_id,
            { message_status: 'read' },
            { new: true }
        );
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            message: 'Error marking message as read',
            error,
        });
    }
};

export const closeSession = async (req: Request, res: Response) => {
    try {
        const { session_id } = req.body;
        const session = await Session.findByIdAndUpdate(
            session_id,
            { status: 'closed' },
            { new: true }
        );
        res.status(200).json(session);
    } catch (error) {
        res.status(500).json({ message: 'Error closing session', error });
    }
};
