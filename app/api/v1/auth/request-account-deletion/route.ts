import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, fetchBackend, parseJsonResponse } from '@/lib/api-proxy'
import { clearAuthCookies } from '@/lib/auth-cookies'

export async function POST(request: NextRequest) {
  const token = await getAuthToken(request)
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const res = await fetchBackend('/auth/request-account-deletion', token, { method: 'POST' })
    const data = await parseJsonResponse(res)
    const response = NextResponse.json(data, { status: res.status })
    if (res.ok) {
      clearAuthCookies(response)
    }
    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to request account deletion'
    return NextResponse.json({ message }, { status: 502 })
  }
}
