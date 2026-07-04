
const BBASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

type RequestOptions = {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;
    // const token = localStorage.getItem('token');
    // if (token) {
    //     headers['Authorization'] = `Bearer ${token}`;
    // }
    const config: RequestInit = {
        method,
        headers: {
            'Content-type': 'application/json',
            ...headers,
        },
        credentials: "include",
        ...(body ? { body: JSON.stringify(body) } : {}),
    }

    const rs = await fetch(`${BBASE_URL}/${endpoint}`, config);
    if (rs.status === 401 || rs.status === 403) {
        const refreshTokenResponse = await fetch(`${BBASE_URL}/auth/refresh`, {
            method: "POST",
            credentials: "include",
        });
        if (refreshTokenResponse.ok) {
            return request<T>(endpoint, options);
        }
    }

    if (!rs.ok) {
        const error: { message?: string } = await rs.json().catch(() => ({ message: rs.statusText }))
        throw new Error(`Error fetching ${endpoint}: ${error.message}`);
    }
    return await rs.json();
}


export const apiClient = {
    get: <T,>(url: string, headers?: Record<string, string>) => request<T>(url, { method: 'GET', headers }),
    post: <T,>(url: string, body: unknown, headers?: Record<string, string>) => request<T>(url, { method: 'POST', body, headers }),
    put: <T,>(url: string, body: unknown, headers?: Record<string, string>) => request<T>(url, { method: 'PUT', body, headers }),
    patch: <T,>(url: string, body: unknown, headers?: Record<string, string>) => request<T>(url, { method: 'PATCH', body, headers }),
    delete: <T,>(url: string, headers?: Record<string, string>) => request<T>(url, { method: 'DELETE', headers }),
};