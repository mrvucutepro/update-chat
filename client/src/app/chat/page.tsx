'use client';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function ChatPage() {
    const [messages, setMessages] = useState<
        { sender: string; message: string }[]
    >([]);
    const [input, setInput] = useState('');
    const socket = io('http://localhost:5000');
    const userId = 'user123';
    useEffect(() => {
        socket.emit('join-chat', { userId });

        socket.on('receive-message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => {
            socket.off('receive-message');
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim()) {
            const newMessage = { sender: userId, message: input };
            setMessages((prev) => [...prev, newMessage]);
            socket.emit('send-message', newMessage);
            setInput('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    };

    return (
        <div
            className="text-black"
            style={{ padding: '4px', background: '#f8f9fa', height: '100vh' }}
        >
            <h2>Live Chat</h2>
            <div
                style={{
                    height: '70vh',
                    overflowY: 'scroll',
                    border: '1px solid #ddd',
                    padding: '2px',
                }}
            >
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.sender}:</strong> {msg.message}
                    </p>
                ))}
            </div>
            <div className="mt-2 flex justify-between">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder=""
                    className="border rounded w-[80%] p-2"
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={sendMessage}
                    className="bg-orange-300 p-2 rounded cursor-pointer"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
