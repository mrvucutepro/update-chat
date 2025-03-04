'use client';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/store/AuthContext';
import UserGuard from '@/middleware/UserGuard';
import UserChat from '@/components/UserChat';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext)!;
    const router = useRouter();

    if (!user) {
        router.push('/');
        return null;
    }

    return (
        <UserGuard>
            <div className="p-6">
                <h1 className="text-2xl">Welcome, {user.username}</h1>
                <p>Role: {user.role}</p>
                <button
                    onClick={logout}
                    className="mt-4 bg-red-500 text-white px-4 py-2"
                >
                    Logout
                </button>
                <UserChat username={'user1'} />
            </div>
        </UserGuard>
    );
}
