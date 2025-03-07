import { Session } from '@/app/types';
import React from 'react';

interface ListUserActiveProps {
    activeSessions: Session[];
    onJoinSession: (sessionId: string) => void;
}

const ListUserActive: React.FC<ListUserActiveProps> = ({
    activeSessions,
    onJoinSession,
}) => {
    return (
        <div className="max-w-lg mx-auto bg-white shadow-md border border-black p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Active Users
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="border border-gray-300 px-4 py-2">
                                Username
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeSessions.map((session) => (
                            <tr
                                key={session._id}
                                className="text-center hover:bg-gray-100"
                            >
                                <td className="border text-black border-gray-300 px-4 py-2">
                                    {session.user_id.username}
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        onClick={() =>
                                            onJoinSession(session._id)
                                        }
                                        className="bg-orange-600 text-white px-3 py-1 rounded-md hover:bg-orange-500 h transition"
                                    >
                                        Join
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListUserActive;
