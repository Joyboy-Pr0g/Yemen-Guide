import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
const BBF_API_URL = process.env.NEXT_PUBLIC_BBF_API_URL || 'http://localhost:3000/api/v1'

export async function getAuthToken(request?: NextRequest | Request): Promise<string | undefined> {
  const authHeader = request?.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }

  const cookieHeader = request?.headers.get('cookie')
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]*)/)
    if (match?.[1]) return decodeURIComponent(match[1])
  }

  return (await cookies()).get('auth_token')?.value
}

export async function parseJsonResponse(res: Response): Promise<unknown> {
  const contentType = res.headers.get('content-type') ?? ''

  if (!contentType.includes('application/json')) {
    const text = await res.text()
    throw new Error(
      `Expected JSON from backend (${res.status}), got ${contentType || 'unknown type'}: ${text.slice(0, 120)}`
    )
  }

  return res.json()
}

export async function fetchBackend(
  path: string,
  token: string,
  options?: RequestInit
): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...(options?.headers as Record<string, string> | undefined),
  }

  if (
    options?.body &&
    typeof options.body === 'string' &&
    !headers['Content-Type'] &&
    !headers['content-type']
  ) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })
}

