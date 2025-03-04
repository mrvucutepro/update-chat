'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/store/AuthContext';

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
    const auth = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!auth?.user || auth?.user.role !== 'admin') {
            router.push('/');
        }
    }, [auth, router]);

    if (!auth?.user || auth?.user.role !== 'admin') {
        return null;
    }

    return <>{children}</>;
};

export default AdminGuard;
