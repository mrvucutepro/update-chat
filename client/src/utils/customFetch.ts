const API_URL = 'http://localhost:5000';

const customFetch = async (
    endpoint: string,
    method: string = 'GET',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
    token?: string
) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', (error as Error).message);
        throw new Error((error as Error).message);
    }
};

export default customFetch;
