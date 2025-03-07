import { LoginResponse, Session, User } from '@/app/types';
import { customFetch } from './customFetch';
import socket from './socket';

// Định nghĩa base URL
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsers = async (token: string): Promise<User[]> => {
    return customFetch<User[]>(`${BASE_URL}/users`, 'GET', null, {
        Authorization: `Bearer ${token}`,
    });
};

// Lấy danh sách counselor
export const getCounselors = async (token: string): Promise<User[]> => {
    return customFetch<User[]>(`${BASE_URL}/counselors`, 'GET', null, {
        Authorization: `Bearer ${token}`,
    });
};

// API đăng nhập
export const login = async (
    username: string,
    password: string
): Promise<LoginResponse> => {
    return customFetch<LoginResponse>(`${BASE_URL}/login`, 'POST', {
        username,
        password,
    });
};

// API lấy thông tin người dùng
export const getProfile = async (token: string): Promise<User> => {
    return customFetch<User>(`${BASE_URL}/profile`, 'GET', null, {
        Authorization: `Bearer ${token}`,
    });
};

// API tạo session (ví dụ)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createNewSession = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        // Tạo session mới
        const response = await customFetch(
            `${BASE_URL}/sessions`,
            'POST',
            { user_id: 'user-id-123' },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        // Tham gia phòng chat
        socket.emit('joinRoom', response._id);
    } catch (error) {
        console.error(
            'Error creating session:',
            error instanceof Error ? error.message : 'Unknown error'
        );
    }
};

// API lấy danh sách session (ví dụ)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSessions = async (token: string): Promise<any> => {
    return customFetch(`${BASE_URL}/sessions`, 'GET', null, {
        Authorization: `Bearer ${token}`,
    });
};

// API xóa session (ví dụ)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteSession = async (
    sessionId: string,
    token: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
    return customFetch(`${BASE_URL}/sessions/${sessionId}`, 'DELETE', null, {
        Authorization: `Bearer ${token}`,
    });
};

export const joinSession = async (
    sessionId: string,
    counselorId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    token: string
) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        const response = await customFetch(
            `${BASE_URL}/sessions/join`,
            'POST',
            { session_id: sessionId, counselor_id: counselorId },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        socket.emit('joinRoom', sessionId);
        console.log('Joined session:', response);
    } catch (error) {
        console.error(
            'Error joining session:',
            error instanceof Error ? error.message : 'Unknown error'
        );
    }
};
export const sendMessage = async (
    sessionId: string,
    senderId: string,
    message: string,
    isInternal: boolean
) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        const response = await customFetch(
            `${BASE_URL}/messages`,
            'POST',
            {
                session_id: sessionId,
                sender_id: senderId,
                message,
                is_internal: isInternal,
            },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        console.log('Message sent:', response);
    } catch (error) {
        console.error(
            'Error sending message:',
            error instanceof Error ? error.message : 'Unknown error'
        );
    }
};

export const markMessageAsRead = async (messageId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        const response = await customFetch(
            `${BASE_URL}/messages/mark-read`,
            'PUT',
            { message_id: messageId },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        console.log('Message marked as read:', response);
    } catch (error) {
        console.error(
            'Error marking message as read:',
            error instanceof Error ? error.message : 'Unknown error'
        );
    }
};

export const closeSession = async (sessionId: string) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login first');
            return;
        }

        const response = await customFetch(
            `${BASE_URL}/sessions/close`,
            'PUT',
            { session_id: sessionId },
            {
                Authorization: `Bearer ${token}`,
            }
        );
        console.log('Session closed:', response);
    } catch (error) {
        console.error(
            'Error closing session:',
            error instanceof Error ? error.message : 'Unknown error'
        );
    }
};

export const getActiveSessions = async (token: string): Promise<Session[]> => {
    return customFetch<Session[]>(`${BASE_URL}/sessions/active`, 'GET', null, {
        Authorization: `Bearer ${token}`,
    });
};

export const getActiveSessionByUser = async (
    userId: string,
    token: string
): Promise<Session> => {
    return customFetch<Session>(
        `${BASE_URL}/sessions/active/${userId}`,
        'GET',
        null,
        {
            Authorization: `Bearer ${token}`,
        }
    );
};
