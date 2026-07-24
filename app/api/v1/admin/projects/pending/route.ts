import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, parseJsonResponse, fetchBackend } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params = new URLSearchParams()
    params.set('page', searchParams.get('page') || '1')
    params.set('search', searchParams.get('search') || '')


    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/admin/projects/pending?${params.toString()}`, token)
    const responseData = await parseJsonResponse(res)

    return NextResponse.json(responseData, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch projects'
    return NextResponse.json({ message }, { status: 502 })
  }
}

