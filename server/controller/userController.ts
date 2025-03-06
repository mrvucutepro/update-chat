import { Request, Response } from 'express';
import User, { IUser } from '../models/User'; // Đảm bảo đường dẫn đến model User là chính xác
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Hàm đăng ký người dùng
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, role } = req.body;

        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser: IUser = new User({
            username,
            password: hashedPassword,
            role,
        });
        const savedUser: IUser = await newUser.save();

        // Trả về thông tin người dùng (không trả về mật khẩu)
        const userResponse = { ...savedUser.toObject(), password: undefined };
        res.status(201).json(userResponse);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Hàm đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Tìm người dùng trong database
        const user: IUser | null = await User.findOne({ username });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // So sánh mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }

        // Tạo token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key', // Sử dụng biến môi trường hoặc một chuỗi bí mật
            { expiresIn: '1h' }
        );

        // Trả về token và thông tin người dùng (không trả về mật khẩu)
        const userResponse = { ...user.toObject(), password: undefined };
        res.status(200).json({ token, user: userResponse });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Hàm lấy thông tin một người dùng
export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.params.id;
        const user: IUser | null = await User.findById(userId);
        if (user) {
            const userResponse = { ...user.toObject(), password: undefined };
            res.status(200).json(userResponse);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Hàm lấy danh sách tất cả người dùng
export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users: IUser[] = await User.find();
        const usersResponse = users.map((user) => ({
            ...user.toObject(),
            password: undefined,
        }));
        res.status(200).json(usersResponse);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
