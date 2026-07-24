import type { Project, PaginatedMeta, VerificationApplication, TraderStats } from '@/types'
import { cookies } from 'next/headers'

const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'

const serverFetch = async <T>(path: string, method: string = 'GET', options?: RequestInit): Promise<T> => {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    const res = await fetch(`${BBF_API_URL}${path}`, {
        headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method,
        ...options,
    })

    if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`)
    }

    const contentType = res.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
        throw new Error(`Expected JSON from ${path}, got ${contentType || 'unknown type'}`)
    }

    return res.json()
}

export const getFavorites = async (page = 1): Promise<{ projects: Project[], meta: PaginatedMeta }> => {
    const data = await serverFetch<{ projects: Project[], meta: PaginatedMeta }>(`/me/projects/favorites?page=${page}`, 'GET', {
        next: { revalidate: 3600 },
    })
    return data
}

