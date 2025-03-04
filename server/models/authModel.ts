import db from '../database/db';
import { User } from '../types/express';

export const findUserByUsername = (username: string): User | undefined => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username) as User | undefined;
};
