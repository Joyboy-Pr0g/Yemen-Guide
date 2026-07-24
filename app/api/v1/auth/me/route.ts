import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'
import { setUserRoleCookie } from '@/lib/auth-cookies'
import type { Role } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend('/auth/me', token)
    const data = await parseJsonResponse(res) as { user?: { role?: Role } }

    const response = NextResponse.json(data, { status: res.status })

    if (res.ok && data.user?.role) {
      setUserRoleCookie(response, data.user.role)
    }

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user'
    return NextResponse.json({ message }, { status: 502 })
  }
}
