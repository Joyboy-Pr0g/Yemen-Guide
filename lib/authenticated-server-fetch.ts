import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'

type AuthenticatedFetchOptions = RequestInit & {
    loginRedirect?: string
}

export async function authenticatedServerFetch<T>(
    path: string,
    method = 'GET',
    options?: AuthenticatedFetchOptions,
): Promise<T> {
    const loginRedirect = options?.loginRedirect ?? '/auth/login'
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
        redirect(`/auth/login?redirect=${encodeURIComponent(loginRedirect)}`)
    }

    const { loginRedirect: _, ...fetchOptions } = options ?? {}

    const res = await fetch(`${BBF_API_URL}${path}`, {
        method,
        ...fetchOptions,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            ...(fetchOptions.headers as Record<string, string> | undefined),
        },
    })

    if (res.status === 401 || res.status === 403) {
        redirect(`/auth/login?redirect=${encodeURIComponent(loginRedirect)}`)
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`)
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
        throw new Error(`Expected JSON from ${path}, got ${contentType || 'unknown type'}`)
    }

    return res.json()
}
