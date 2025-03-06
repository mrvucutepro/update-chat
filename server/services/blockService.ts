import { Request, Response } from 'express';

export const blockUser = async (req: Request, res: Response) => {
    try {
        const { userId, blockType } = req.body;
        // Logic block user
        res.json({ message: `User ${userId} blocked with type ${blockType}` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const unblockUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        // Logic unblock user
        res.json({ message: `User ${userId} unblocked` });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
