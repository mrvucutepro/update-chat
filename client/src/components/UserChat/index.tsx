'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const UserChat = ({ username }: { username: string }) => {
    const [messages, setMessages] = useState<
        { sender: string; text: string }[]
    >([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        socket.on('receive-message-client', ({ sender, text }) => {
            setMessages((prev) => [...prev, { sender, text }]);
        });

        return () => {
            socket.off('receive-message-client');
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit('send-message-client', {
                sender: 'User',
                text: message,
            });
            setMessages((prev) => [...prev, { sender: 'User', text: message }]);
            setMessage('');
        }
    };

    return (
        <div className="w-full max-w mx-auto border rounded-lg shadow-lg flex flex-col h-[400px] bg-white">
            <div className="bg-green-600 text-white py-2 px-4 text-center font-semibold">
                Chat with Admin
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-md max-w-xs ${
                            msg.sender === username
                                ? 'bg-green-500 text-white self-end ml-auto'
                                : 'bg-gray-200'
                        }`}
                    >
                        <span className="block text-sm font-semibold">
                            {msg.sender}
                        </span>
                        <p>{msg.text}</p>
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
