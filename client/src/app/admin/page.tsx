'use client';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/store/AuthContext';
import AdminGuard from '@/middleware/AdminGuard';
import AdminChat from '@/components/AdminChat';

export default function AdminPage() {
    const { user, logout } = useContext(AuthContext)!;
    const router = useRouter();

    if (!user || user.role !== 'admin') {
        router.push('/user');
        return null;
    }

    return (
        <AdminGuard>
            <div className="p-6">
                <h1 className="text-2xl">Admin Dashboard</h1>
            </div>
            <button
                onClick={logout}
                className="mt-4 bg-red-500 text-white px-4 py-2"
            >
                Logout
            </button>
            <AdminChat />
        </AdminGuard>
    );
}
