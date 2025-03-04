'use client';

import { AuthContext } from '@/store/AuthContext';
import { useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
    transports: ['polling', 'websocket'],
});

const UserChat = () => {
    const [messages, setMessages] = useState<
        { sender: string; text: string }[]
    >([]);
    const [message, setMessage] = useState('');
    const { user } = useContext(AuthContext)!;

    useEffect(() => {
        if (!user) return;

        socket.emit('register-user', { username: user.username });

        socket.off('receive-message-admin');
        socket.off('receive-message-client');
        socket.on('receive-message-admin', (data) => {
            setMessages((prev) => [
                ...prev,
                { sender: data.sender, text: data.text },
            ]);
        });
        socket.on('receive-message-client', (data) => {
            setMessages((prev) => [
                ...prev,
                { sender: data.sender, text: data.text },
            ]);
        });

        return () => {
            socket.off('receive-message-admin');
            socket.off('receive-message-client');
        };
    }, [user]);

    const sendMessage = () => {
        if (message.trim() === '') return;

        const newMessage = { sender: user.username, text: message };
        setMessages((prev) => [...prev, newMessage]);

        socket.emit('send-message-client', newMessage);
        setMessage('');
    };

    return (
        <div className="w-full max-w mx-auto border  shadow-lg flex flex-col h-[50%] bg-white">
            <div className="bg-blue-400 text-white py-2 px-4 text-center font-semibold">
                Chat with Admin
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-md max-w-xs ${
                            msg.sender === user.username
                                ? 'bg-blue-400 text-white self-end ml-auto'
                                : 'bg-gray-200 font-light text-gray-700'
                        }`}
                    >
                        <span className="block text-sm font-semibold">
                            <p>{msg.text}</p>
                        </span>
                    </div>
                ))}
            </div>

            <div className="p-2 border-t flex">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-l-md outline-none"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button
                    className="bg-green-600 text-white px-4 rounded-r-md"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default UserChat;
