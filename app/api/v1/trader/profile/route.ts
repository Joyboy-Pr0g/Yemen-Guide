import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function PUT(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const res = await fetchBackend('/trader/profile', token, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
    const responseData = await parseJsonResponse(res)

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update profile'
    return NextResponse.json({ message }, { status: 502 })
  }
}
