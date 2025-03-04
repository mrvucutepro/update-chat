'use client';
import { useContext } from 'react';
import { AuthContext } from '@/store/AuthContext';
import UserGuard from '@/middleware/UserGuard';
import UserChat from '@/components/UserChat';

export default function UserPage() {
    const { logout } = useContext(AuthContext)!;

    return (
        <UserGuard>
            <div className="p-6">
                <button
                    onClick={logout}
                    className="mt-4 bg-red-500 text-white px-4 py-2"
                >
                    Logout
                </button>
                <UserChat />
            </div>
        </UserGuard>
    );
}
