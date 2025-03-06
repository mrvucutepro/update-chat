'use client';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

import AdminChat from '@/components/AdminChat';
import { useEffect } from 'react';

export default function AdminPage() {
    const router = useRouter();
    useEffect(() => {
        if (!Cookies.get('adminToken')) {
            router.push('/');
        }
    }, []);

    const handleLogout = () => {
        Cookies.remove('adminToken');
        router.push('/');
    };
    return <AdminChat onLogout={handleLogout} />;
}
