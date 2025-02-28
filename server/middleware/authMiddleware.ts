import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = "your_secret_key"; // Đổi thành key bảo mật thật

export function generateToken(payload: object): string {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET_KEY);
}

export function hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
}
