import { customFetch } from './customFetch';
import Cookies from 'js-cookie';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export async function loginAdmin(username: string, password: string) {
    return customFetch(`${apiUrl}/admin/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });
}

export function logoutAdmin() {
    Cookies.remove('adminToken');
}
