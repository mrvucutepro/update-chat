import React, { useState } from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
} from 'react-router-dom';

import { toast } from 'react-hot-toast';

export const AuthComponent = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    const register = async () => {
        await axios.post('http://localhost:5000/register', {
            username,
            password,
        });
        alert('Register successful');
        // toast.success('User registered successfully');
    };

    const login = async () => {
        try {
            const res = await axios.post('http://localhost:5000/login', {
                username,
                password,
            });
            localStorage.setItem('token', res.data.token);
            alert('Login successful');
            // toast.success('Login successful');
            setToken(res.data.token);
            navigate('/chat-client');
        } catch (error) {
            toast.error((error as any).response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Chat App
                </h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={register}
                        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        Register
                    </button>
                </div>

                <div className="mb-4">
                    <button
                        onClick={login}
                        className="w-full bg-green-500 text-white p-3 rounded-md hover:bg-green-600 focus:outline-none"
                    >
                        Login
                    </button>
                </div>

                {token && (
                    <p className="text-center text-green-500">
                        Login successfully
                    </p>
                )}
            </div>
        </div>
    );
};
