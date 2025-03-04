import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
export const generateToken = (payload: object): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};
