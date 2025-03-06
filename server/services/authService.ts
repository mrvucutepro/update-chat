import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
