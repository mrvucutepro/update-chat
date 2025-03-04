import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express';
import dotenv from 'dotenv';

dotenv.config();
export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET as string;
    if (!token) {
        res.status(401).json({ message: 'Access denied' });
        return;
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded as any;
        next();
    } catch {
        res.status(403).json({ message: 'Invalid token' });
    }
};

export const authorizeRole = (role: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};
