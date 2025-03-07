'use client';

import React, { useEffect, useState } from 'react';
import { getActiveSessions, getProfile, joinSession } from '@/utils/api';
import Chat from '@/components/Chat';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import ListUserActive from '@/components/ListUserActive';
import { Session } from '../types';

const CounselorPage = () => {
    const [userId, setUserId] = useState('');
    const [roomId, setRoomId] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeSessions, setActiveSessions] = useState<Session[]>([]);

    useEffect(() => {
        const fetchProfileAndSessions = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/'); // Chuyển hướng về trang đăng nhập nếu không có token
                    return;
                }

                // Lấy thông tin counselor
                const profile = await getProfile(token);
                setUserId(profile.id);

                const sessions = await getActiveSessions(token);
                setActiveSessions(sessions);

                const roomId = searchParams.get('roomId');
                if (roomId) {
                    setRoomId(roomId);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                router.push('/');
            }
        };

        fetchProfileAndSessions();
    }, [router, searchParams]);

    const handleJoinSession = async (sessionId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Please login first');
                return;
            }

            // Counselor tham gia session
            await joinSession(sessionId, userId, token);

            // Chuyển hướng đến trang counselor với roomId
            router.push(`/counselor?roomId=${sessionId}`);
        } catch (error) {
            console.error('Error joining session:', error);
        }
    };

    return (
        <div>
            <div className="flex">
                <ListUserActive
                    activeSessions={activeSessions}
                    onJoinSession={handleJoinSession}
                />

                {roomId && (
                    <Chat roomId={roomId} userId={userId} isCounselor={true} />
                )}
            </div>
        </div>
    );
};

export default CounselorPage;
