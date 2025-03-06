import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
    user?: IUser;
}

const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            res.status(401).json({ message: 'No auth token provided' });
            return;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default_secret'
        ) as { id: string };
        const user = await User.findById(decoded.id);

        if (!user) {
            res.status(401).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

export const counselorAuth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await auth(req, res, () => {
            if (req.user?.role !== 'counselor') {
                res.status(403).json({
                    message: 'Access denied, not a counselor',
                });
                return;
            }
            next();
        });
    } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
    }
};

export default auth;
