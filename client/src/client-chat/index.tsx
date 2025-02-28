import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3002';
const socket = io(SERVER_URL);

interface Message {
    key: string;
    message: string;
    executeTime: number;
}

export default function ClientChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [serverStatus, setServerStatus] = useState('Đang kết nối...');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                console.log('🔍 Gửi request GET /messages...');
                const response = await axios.get<Message[]>(
                    `${SERVER_URL}/messages`
                );
                setMessages(response.data);
            } catch (error) {
                setServerStatus('Không thể kết nối đến server');
            }
        };
        fetchMessages();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            setServerStatus('Đã kết nối');
        });

        socket.on('disconnect', () => {
            setServerStatus('Mất kết nối đến máy chủ...');
        });

        socket.on('receiveMessage', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
            console.log(msg);
        });

        socket.on('connect_error', (err: Error) => {
            setServerStatus('Lỗi kết nối WebSocket');
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('receiveMessage');
            socket.off('connect_error');
        };
    }, []);

    const sendMessage = () => {
        if (!input.trim()) return;
        socket.emit('sendMessage', input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-screen w-full p-4 bg-gray-100">
            <div className="text-center mb-2 text-sm text-gray-600">
                {serverStatus}
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow-md">
                {messages.length > 0 ? (
                    messages.map(({ key, message, executeTime }) => (
                        <div key={key} className="mb-2">
                            <div className="bg-blue-500 text-white p-2 rounded-lg inline-block">
                                {message}
                            </div>
                            <div className="text-xs text-gray-500 ml-2">
                                {new Date(executeTime).toLocaleTimeString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-center"></div>
                )}
            </div>

            <div className="flex mt-4">
                <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    placeholder=""
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                />
                <button
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={sendMessage}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
}
