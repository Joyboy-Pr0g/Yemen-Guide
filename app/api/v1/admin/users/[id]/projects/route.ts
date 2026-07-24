import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json({ message: 'Missing id parameter' }, { status: 400 })
    }

    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const res = await fetchBackend(`/admin/users/${id}/projects`, token)
    const data = await parseJsonResponse(res)

    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user'
    return NextResponse.json({ message }, { status: 502 })
  }
}
