import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

class UserService {
    // Register user
    async registerUser(
        username: string,
        password: string,
        role: string
    ): Promise<any> {
        try {
            // Check if user exists
            const userExists = await User.findOne({ username });
            if (userExists) {
                throw new Error('User already exists');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await User.create({
                username,
                password: hashedPassword,
                role,
            });

            return {
                _id: user._id,
                username: user.username,
                role: user.role,
                token: this.generateToken(user._id.toString()),
            };
        } catch (error) {
            throw new Error(
                `Error registering user: ${(error as any).message}`
            );
        }
    }

    // Login user
    async loginUser(username: string, password: string): Promise<any> {
        try {
            // Find user
            const user = await User.findOne({ username });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }

            return {
                _id: user._id,
                username: user.username,
                role: user.role,
                token: this.generateToken(user._id.toString()),
            };
        } catch (error) {
            throw new Error(`Error logging in user: ${(error as any).message}`);
        }
    }

    // Get user profile
    async getUserProfile(userId: string): Promise<IUser | null> {
        try {
            const user = await User.findById(userId).select('-password');
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(
                `Error getting user profile: ${(error as any).message}`
            );
        }
    }

    // Generate JWT
    private generateToken(id: string): string {
        return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret', {
            expiresIn: '30d',
        });
    }
}

export default new UserService();
