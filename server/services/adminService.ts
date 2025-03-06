import Admin from '../models/Admin';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Session';
import { sendMessage } from './messageService';

export const getAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await Admin.find();
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const adminLogin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username, password });
        if (!admin) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jwt.sign(
            { id: admin._id, role: 'admin' },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const sendMessageByAdmin = sendMessage;
