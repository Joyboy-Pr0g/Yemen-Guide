import { NextResponse } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/settings/logo`, {
      headers: { Accept: '*/*' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      return NextResponse.json(
        { message: 'Logo not found' },
        { status: res.status },
      )
    }

    const body = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/png'

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch logo'
    return NextResponse.json({ message }, { status: 502 })
  }
}
