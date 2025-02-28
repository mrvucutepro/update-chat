import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';

const router = express.Router();
const SECRET_KEY = 'your_secret_key';

const users: { username: string; passwordHash: string }[] = [];

router.use(cookieParser());

router.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    users.push({ username, passwordHash });
    res.json({ message: 'User registered successfully!' });
});

router.post(
    '/login',
    async (req: express.Request, res: express.Response): Promise<void> => {
        const { username, password } = req.body;
        const user = users.find((u) => u.username === username);

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        res.json({ message: 'Login successful!' });
    }
);

router.post('/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully!' });
});

export default router;
