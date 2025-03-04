'use client';
import { LoginGuard } from '@/middleware/LoginGuard';
import { AuthContext } from '@/store/AuthContext';
import { useState, useContext } from 'react';

export default function LoginPage() {
    const { login } = useContext(AuthContext)!;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await login(username, password);
    };

    return (
        <LoginGuard>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <form
                    onSubmit={handleLogin}
                    className="p-6 bg-white shadow-lg rounded-lg"
                >
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        className="w-full p-2 border mb-2"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2"
                    >
                        Login
                    </button>
                </form>
            </div>
        </LoginGuard>
    );
}
