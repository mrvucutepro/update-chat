import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User'; // Assuming IUser is the interface for User
import { verifyToken } from '../utils/jwt';
import User from '../models/User';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('Authentication failed: No token provided');
        }

        const decoded = verifyToken(token) as { userId: string; role: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            throw new Error('Authentication failed: User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            message: 'Authentication failed',
            error: (error as Error).message,
        });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                message: 'Unauthorized: You do not have permission',
            });
            return;
        }
        next();
    };
};
