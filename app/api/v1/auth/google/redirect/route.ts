import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const role = request.nextUrl.searchParams.get('role')
    const query = role ? `?role=${encodeURIComponent(role)}` : ''
    const res = await fetch(`${API_URL}/auth/google/redirect${query}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ message: 'Failed to start Google login' }, { status: 502 })
  }
}
