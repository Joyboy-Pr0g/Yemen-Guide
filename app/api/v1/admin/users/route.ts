import { NextResponse, NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(
      `/admin/users?page=${page}&search=${search}&role=${role}`,
      token
    )
    const data = await parseJsonResponse(res)

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch users'
    return NextResponse.json({ message }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/admin/users`, token, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    const responseData = await parseJsonResponse(res)

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create user'
    return NextResponse.json({ message }, { status: 502 })
  }
}
