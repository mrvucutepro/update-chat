import Cookies from 'js-cookie';

export async function customFetch(endpoint: string, options: RequestInit = {}) {
    const token = Cookies.get('adminToken');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    } as Record<string, string>;
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers,
        // credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Request failed');
    }
    return response.json();
}
