'use client';

import { useState } from 'react';
import { login } from '../utils/api';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(username, password);

            // Lưu token vào localStorage
            localStorage.setItem('token', response.token);

            // Chuyển hướng dựa trên role
            if (response.user.role === 'user') {
                router.push('/user');
            } else if (response.user.role === 'counselor') {
                router.push('/counselor');
            } else {
                setError('Unknown role');
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Invalid credentials'
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-80">
                <h1 className="text-2xl font-semibold text-center text-gray-700 mb-4">
                    Login
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 text-black border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 text-center mt-2">{error}</p>
                )}
            </div>
        </div>
    );
}
