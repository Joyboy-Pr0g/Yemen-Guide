import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const params = new URLSearchParams({ page })

    const res = await fetchBackend(`/me/projects/favorites?${params.toString()}`, token)
    const data = await parseJsonResponse(res)

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch favorites'
    return NextResponse.json({ message }, { status: 502 })
  }
}
