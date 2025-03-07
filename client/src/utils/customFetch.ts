type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const customFetch = async <T = any>(
    url: string,
    method: HttpMethod = 'GET',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: Record<string, any> | null = null,
    headers: Record<string, string> = {}
): Promise<T> => {
    try {
        // Default headers
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };

        // Merge default headers with custom headers
        const requestHeaders = {
            ...defaultHeaders,
            ...headers,
        };

        // Configure the request options
        const requestOptions: RequestInit = {
            method,
            headers: requestHeaders,
        };

        // Add body if present (only for POST, PUT, PATCH, etc.)
        if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
            requestOptions.body = JSON.stringify(body);
        }

        // Make the request
        const response = await fetch(url, requestOptions);

        // Check if the response is OK (status code 2xx)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Something went wrong');
        }

        // Parse and return the response data
        const data: T = await response.json();
        return data;
    } catch (error) {
        console.error(
            'Fetch error:',
            error instanceof Error ? error.message : 'Unknown error'
        );
        throw error;
    }
};
