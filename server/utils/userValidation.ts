import { Request, Response } from 'express';
import User from '../models/Session';
import crypto from 'crypto';

export const validateUser = async (req: Request, res: Response) => {
    const { userId, userCode } = req.body;
    const user = await User.findOne({ MemberID: userId });

    if (user && userCode === generateUserCode(user)) {
        res.json({ valid: true, userId: user._id });
        return;
    }
    res.status(401).json({ valid: false });
};

function generateUserCode(user: any) {
    const host = '127.0.0.1'; // Change to actual host if needed
    return crypto
        .createHash('md5')
        .update(
            `${user.BrandName}${user.MemberID}${user.IP}${host}6c548acd-d4b6-4c96-ab2f-fe321571f752`
        )
        .digest('hex');
}
