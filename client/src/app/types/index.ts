export interface User {
    id: string;
    username: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface ProfileResponse {
    id: string;
    username: string;
    role: string;
}

export interface Session {
    _id: string;
    user_id: User; // Thông tin user
    created_at: Date;
    status: string; // Trạng thái session (active/closed)
}
