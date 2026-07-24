import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken } from '@/lib/api-proxy'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    if (!slug) {
      return NextResponse.json(
        { status: 'error', message: 'Missing slug parameter' },
        { status: 400 },
      )
    }

    const token = await getAuthToken(req)
    const deviceId = req.headers.get('x-device-id')
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    if (deviceId) {
      headers['X-Device-Id'] = deviceId
    }

    const res = await fetch(`${API_URL}/projects/${slug}`, {
      headers,
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      let message = 'Failed to fetch project'
      try {
        const parsed = JSON.parse(body) as { message?: string }
        if (parsed.message) message = parsed.message
      } catch {
        // use default message
      }
      return NextResponse.json(
        { status: 'error', message },
        { status: res.status },
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch project' },
      { status: 500 },
    )
  }
}
