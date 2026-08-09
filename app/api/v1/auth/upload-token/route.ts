import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken } from '@/lib/api-proxy'

/** Returns Bearer token for large direct-to-Laravel uploads (httpOnly cookie is not readable client-side). */
export async function GET(request: NextRequest) {
  const token = await getAuthToken(request)
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ token })
}
