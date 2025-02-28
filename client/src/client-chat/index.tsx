import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
export const Chat = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            alert('You are logout');
        }
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/');
    };
    return (
        <>
            <h1>Welcome to the Chat!</h1>
            <button onClick={logout}>Logout</button>
        </>
    );
};

export default Chat;
