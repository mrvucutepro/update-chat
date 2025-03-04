'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { doLogin } from '../utils/api';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any;
    isAdmin: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded: any = jwtDecode(token);
            setUser({ username: decoded.username, role: decoded.role });
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const { token } = await doLogin(username, password);
            localStorage.setItem('token', token);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const decoded: any = jwtDecode(token);
            setUser({ username: decoded.username, role: decoded.role });
            if (decoded.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/user');
            }
        } catch (error) {
            console.error('Login failed', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAdmin: user?.role === 'admin',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
