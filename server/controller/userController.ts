import { Request, Response } from 'express';
import { generateToken, verifyToken } from '../utils/jwt';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
    try {
        const { username, password, role } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({
                message: 'Username already exists',
                success: false,
            });
            return;
        }
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({
            message: 'User registered successfully',
            user,
            success: false,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: (error as Error).message,
            success: false,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(404).json({ message: 'User not found', success: false });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(400).json({
                message: 'Invalid credentials',
                success: false,
            });
            return;
        }

        const token = generateToken(user._id.toString(), user.role);
        res.status(200).json({
            message: 'Login successful',
            token,
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error,
            success: false,
        });
    }
};

export const getCounselors = async (req: Request, res: Response) => {
    try {
        const counselors = await User.find(
            { role: 'counselor' }
            // { password: 0 }
        );
        res.status(200).json(counselors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching counselors', error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find(
            {}
            // { password: 0 }
        );
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getProfile = async (req: Request, res: Response) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'No token provided' });
            return;
        }

        const decoded = verifyToken(token) as { userId: string; role: string };
        const user = await User.findById(decoded.userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            id: user._id,
            username: user.username,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};
