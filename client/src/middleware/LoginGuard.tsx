'use client';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/store/AuthContext';

export const LoginGuard = ({ children }: { children: React.ReactNode }) => {
    const auth = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (auth?.user) {
            if (auth.user.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/user');
            }
        }
    }, [auth, router]);

    if (auth?.user) {
    }

    return <>{children}</>;
};
