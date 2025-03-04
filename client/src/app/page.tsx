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
            <div className=" flex items-center justify-center h-screen bg-gray-100">
                <form
                    onSubmit={handleLogin}
                    className="p-6 bg-[#6a5548] shadow-lg rounded-lg w-[30%]"
                >
                    <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                    <div className="flex justify-between items-center">
                        <span>Username</span>
                        <input
                            type="text"
                            placeholder="Username"
                            className=" p-2  mb-2 text-black rounded w-[70%] bg-white"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between items-center ">
                        <span>Password</span>
                        <input
                            type="password"
                            placeholder="Password"
                            className=" p-2  mb-4 text-black rounded w-[70%] bg-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-[40%]  bg-orange-500 text-white py-2"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </LoginGuard>
    );
}
