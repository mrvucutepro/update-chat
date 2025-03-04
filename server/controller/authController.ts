// import { Request, Response } from 'express';
// import { loginUser } from '../database/db';

// export const login = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { username, password } = req.body;
//         const token = await loginUser(username, password);
//         if (!token) {
//             res.status(401).json({ message: 'Invalid credentials' });
//             return;
//         }
//         res.json({ token });
//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// };
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtUtils';
import { AuthenticatedRequest } from '../types/express';
import { findUserByUsername } from '../models/authModel';

export const login = (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = findUserByUsername(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    const token = generateToken({
        id: user.id,
        username: user.username,
        role: user.role,
    });
    res.json({ token });
};

export const getProfile = (req: AuthenticatedRequest, res: Response) => {
    res.json({ user: req.user });
};
