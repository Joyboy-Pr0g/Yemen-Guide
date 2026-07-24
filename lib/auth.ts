import { LoginData, RegisterData, User } from "@/types";

const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'

async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${BBF_API_URL}${path}`, {
        credentials: 'include',
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options?.headers as Record<string, string> | undefined),
        },
    })

    const data = await res.json()
    if (!res.ok) {
        throw new Error(data?.message || `API Error: ${res.status}`)
    }

    return data
}

export const loginApi = async (data: LoginData) => {
    return authFetch<{ user: User; message: string }>('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
};

export const googleLoginApi = async (role?: 'visitor' | 'trader') => {
    const query = role ? `?role=${role}` : ''
    const data = await authFetch<{ url: string }>(`/auth/google/redirect${query}`)
    return data.url
};

export type GoogleCallbackResult =
    | { needs_role: true; signup_token: string; email: string; name: string; message: string }
    | { needs_role?: false; user: User; message: string }

export const googleCallbackApi = async (query: string) => {
    return authFetch<GoogleCallbackResult>(`/auth/google/callback?${query}`)
};

export const googleCompleteApi = async (signupToken: string, role: 'visitor' | 'trader') => {
    return authFetch<{ user: User; message: string }>('/auth/google/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signup_token: signupToken, role }),
    })
};

export const registerApi = async (data: RegisterData) => {
    return authFetch<{ message: string }>('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })
};

export const logoutApi = async () => {
    return authFetch<{ message: string }>('/auth/logout', { method: 'POST' })
}

export const getCurrentUserApi = async (): Promise<User> => {
    const data = await authFetch<{ user: User }>('/auth/me')
    return data.user
}

export const sendOtpApi = async (): Promise<{ message: string }> => {
    return authFetch<{ message: string }>('/auth/send-otp', { method: 'POST', headers: { 'Content-Type': 'application/json' } })
}

export const verifyOtpApi = async (otp: string): Promise<{ message: string }> => {
    return authFetch<{ message: string }>('/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
    })
}

export const forgotPasswordApi = async (email: string): Promise<{ message: string }> => {
    return authFetch<{ message: string }>('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    })
}