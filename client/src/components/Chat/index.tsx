import socket from '@/utils/socket';
import React, { useEffect, useState } from 'react';

interface Message {
    senderId: string;
    content: string;
    isInternal: boolean;
    timestamp: Date;
}

interface ChatProps {
    roomId: string;
    userId: string;
    isCounselor?: boolean;
}

const Chat: React.FC<ChatProps> = ({ roomId, userId, isCounselor = false }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.connect();

        // Tham gia phòng chat khi component được mount
        socket.emit('joinRoom', roomId);
        console.log(`Joined room: ${roomId}`);

        const handleReceiveMessage = (message: Message) => {
            console.log('Received message:', message);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        socket.on('receiveMessage', handleReceiveMessage);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.disconnect();
        };
    }, [roomId]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && newMessage.trim() !== '') {
            console.log('Submitted message:', newMessage);
            setNewMessage('');
        }
    };

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            // Gửi tin nhắn đến server
            socket.emit('sendMessage', {
                roomId,
                senderId: userId,
                content: newMessage,
                isInternal: isCounselor,
            });
            console.log('Sent message:', {
                roomId,
                senderId: userId,
                content: newMessage,
            });
            // Xóa nội dung tin nhắn sau khi gửi
            setNewMessage('');
        } else {
            console.log('Message is empty or contains only whitespace');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100 w-full ">
            <h2 className="bg-blue-600 text-white text-center py-4 text-lg font-semibold shadow-md">
                Chat Room: {roomId}
            </h2>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            msg.senderId === userId
                                ? 'justify-end'
                                : 'justify-start'
                        }`}
                    >
                        <div
                            className={`px-4 py-2 rounded-lg shadow-md max-w-xs ${
                                msg.senderId === userId
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-black'
                            }`}
                        >
                            <strong className="block text-sm">
                                {msg.senderId}
                            </strong>
                            <p>{msg.content}</p>
                            <span className="text-xs text-gray-200">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-white p-3 border-t flex text-black">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder=""
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 border rounded-lg outline-none"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className={`ml-2 px-4 py-2 rounded-lg transition ${
                        newMessage.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
