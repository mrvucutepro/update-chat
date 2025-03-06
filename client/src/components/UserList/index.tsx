import { useEffect, useState } from 'react';
import { socket } from '../../utils/socket';
// import { io } from 'socket.io-client';

interface UserListProps {
    onSelectUser?: (userId: string) => void;
}
export default function UserList({ onSelectUser }: UserListProps) {
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        socket.on('user-online-list', (users) => {
            setOnlineUsers(users);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // useEffect(() => {
    //     async function fetchUsers() {
    //         try {
    //             const response = await customFetch('/api/admin/users');
    //             setUsers(response);
    //         } catch (error) {
    //             console.error((error as Error).message);
    //         }
    //     }
    //     fetchUsers();
    // }, []);

    // useEffect(() => {
    //     socket.on('users_online', (usersList) => {
    //         setUsers(usersList);
    //     });

    //     return () => {
    //         socket.off('users_online');
    //     };
    // }, []);

    return (
        <div className="w-full max-w-md bg-white p-4 border rounded shadow-md mb-4">
            <h3 className="text-lg font-bold">Users List</h3>
            <ul>
                {onlineUsers.map((user) => (
                    <li key={user}>{user}</li>
                ))}
            </ul>
        </div>
    );
}
