import customFetch from './customFetch';

export const doLogin = async (username: string, password: string) => {
    return await customFetch('/api/login', 'POST', { username, password });
};

export const fetchProfile = async (token: string) => {
    return await customFetch('/api/profile', 'GET', undefined, token);
};
