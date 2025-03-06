import { useEffect, useState } from 'react';
import { customFetch } from '../../utils/customFetch';
import UserList from '../UserList';

interface AdminChatProps {
    onLogout: () => void;
}

interface Message {
    message: string;
}
export default function AdminChat({ onLogout }: AdminChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedUser) return;

        async function fetchMessages() {
            try {
                const response = await customFetch('/api/admin/messages');
                setMessages(response);
            } catch (error) {
                console.error((error as Error).message);
            }
        }
        fetchMessages();
    }, [setSelectedUser]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const response = await customFetch('/api/admin/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newMessage }),
            });
            setMessages([...messages, response]);
            setNewMessage('');
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-500">
                Admin Chat
            </h2>
            <button
                onClick={onLogout}
                className="mb-4 bg-red-500 text-white py-2 px-4 rounded"
            >
                Logout
            </button>
            <UserList onSelectUser={setSelectedUser} />
            <div className="w-full max-w-md bg-white p-4 rounded shadow-md mb-4">
                {messages.map((msg, index) => (
                    <p key={index} className="p-2 border-b">
                        {msg.message}
                    </p>
                ))}
            </div>
            <div className="flex w-full max-w-md">
                <input
                    type="text"
                    placeholder=""
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-2 border rounded-l text-black"
                />
                <button
                    onClick={sendMessage}
                    className="bg-orange-500 text-white py-2 px-4 rounded-r"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
