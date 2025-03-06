import { Request, Response } from 'express';
import Message from '../models/Message';

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const messages = await Message.find({ userId });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { userId, message } = req.body;
        const newMessage = new Message({
            userId,
            message,
            timestamp: new Date(),
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
