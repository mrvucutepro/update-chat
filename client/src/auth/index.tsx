import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

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
        navigate('/chat')
      } catch (error) {
        toast.error((error as any).response?.data?.error || 'Login failed');
      }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
            {token && <p>Login successfully</p>}
        </div>
    );
};
