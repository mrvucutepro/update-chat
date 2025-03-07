'use client';
import React, { useEffect, useState } from 'react';
import { BASE_URL, getActiveSessionByUser, getProfile } from '@/utils/api';
import Chat from '@/components/Chat';
import { useRouter } from 'next/navigation';

const ClientPage = () => {
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/');
                    return;
                }

                // Lấy thông tin user
                const profile = await getProfile(token);
                setUserId(profile.id);

                const activeSession = await getActiveSessionByUser(
                    profile.id,
                    token
                );
                if (activeSession) {
                    setRoomId(activeSession._id);
                    return;
                }

                const sessionResponse = await fetch(`${BASE_URL}/sessions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ user_id: profile.id }),
                });
                const sessionData = await sessionResponse.json();
                setRoomId(sessionData._id);
                router.push(`/user?roomId=${sessionData._id}`);
            } catch (error) {
                console.error('Error fetching profile:', error);
                router.push('/');
            }
        };

        fetchProfile();
    }, [router]);

    if (!userId || !roomId) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <Chat roomId={roomId} userId={userId} />
        </div>
    );
};

export default ClientPage;
