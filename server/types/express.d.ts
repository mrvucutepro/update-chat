import { Request } from 'express';

export interface User {
    id: number;
    username: string;
    password: string;
    role: 'user' | 'admin';
}

export interface AuthenticatedUser {
    id: number;
    username: string;
    role: 'user' | 'admin';
}

export interface AuthenticatedRequest extends Request {
    user?: User;
}
