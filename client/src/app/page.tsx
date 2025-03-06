'use client';
import { useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin } from '../utils/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [token, setToken] = useState(Cookies.get('adminToken'));
    const router = useRouter();
    useEffect(() => {
        const storedToken = Cookies.get('adminToken');
        if (storedToken) {
            setToken(storedToken);
            router.push('/admin');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const data = await loginAdmin(username, password);
            Cookies.set('adminToken', data.token, { expires: 1 });
            setToken(data.token);
            router.push('/admin');
        } catch (err) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setError((err as any).message);
        }
    };

    const handleLogout = () => {
        logoutAdmin();
        Cookies.remove('adminToken');
        setToken('');
        router.push('/');
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-black">Admin Login</h2>
            {!token ? (
                <form
                    onSubmit={handleLogin}
                    className="bg-white p-6 rounded-lg shadow-md w-80 text-black"
                >
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mb-3 border rounded"
                    />
                    <button
                        type="submit"
                        className="w-full bg-orange-500 text-white py-2 rounded"
                    >
                        Login
                    </button>
                </form>
            ) : (
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white py-2 px-4 rounded"
                >
                    Logout
                </button>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
