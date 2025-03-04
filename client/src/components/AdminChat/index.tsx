'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminChat = () => {
    const [messages, setMessages] = useState<
        { sender: string; message: string }[]
    >([]);

    const [message, setMessage] = useState('');

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('send-message-admin', {
                sender: 'Admin',
                message: message,
            });
            setMessages((prev) => [
                ...prev,
                { sender: 'Admin', message: message },
            ]);
            setMessage('');
        }
    };

    useEffect(() => {
        socket.on('receive-message-admin', ({ sender, message }) => {
            setMessages((prev) => [...prev, { sender, message }]);
        });

        return () => {
            socket.off('receive-message-admin');
        };
    }, []);

    return (
        <div className="w-full max-w mx-auto border rounded-lg shadow-lg flex flex-col h-[400px] bg-white">
            <div className="bg-red-600 text-white py-2 px-4 text-center font-semibold">
                Admin Chat
            </div>

            <div className="p-2 border-b"></div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-md max-w-xs ${
                            msg.sender === 'admin'
                                ? 'bg-red-500 text-white self-end ml-auto'
                                : 'bg-gray-200'
                        }`}
                    >
                        <span className="block text-sm font-semibold">
                            {msg.sender}
                        </span>
                        <p>{msg.message}</p>
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
                    className="bg-red-600 text-white px-4 rounded-r-md"
                    onClick={sendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default AdminChat;
