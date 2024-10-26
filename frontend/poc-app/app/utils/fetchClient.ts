import useAuthStore from '../store/useAuthStore';

interface FetchOptions extends RequestInit {
    authRequired?: boolean;
}

const BASE_URL = "https://eyebetaitmx-backend.gemii-coin.com";

export const fetchClient = async (endpoint: string, options: FetchOptions = {}) => {
    const { token } = useAuthStore.getState();
    const { authRequired = true, ...fetchOptions } = options;

    const headers = new Headers(options.headers);
    console.log('token', token);
    if (authRequired && token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'An error occurred');
    }

    return response.json();
};