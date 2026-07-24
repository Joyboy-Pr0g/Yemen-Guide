import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'

export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken(request)
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const res = await fetchBackend('/interactions', token, {
      method: 'POST',
      body: JSON.stringify({
        project_id: body.project_id,
        type: body.type ?? 'view',
      }),
    })

    const data = await parseJsonResponse(res)
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to log interaction'
    return NextResponse.json({ message }, { status: 502 })
  }
}
