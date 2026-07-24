import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken } from '@/lib/api-proxy'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const ALLOWED_PARAMS = [
  'city_id',
  'neighborhood_id',
  'category_id',
  'sub_category_id',
  'search',
  'page',
  'per_page',
  'lat_min',
  'lat_max',
  'lng_min',
  'lng_max',
] as const

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken(req)
    const params = new URLSearchParams()

    for (const key of ALLOWED_PARAMS) {
      const value = req.nextUrl.searchParams.get(key)
      if (value) {
        params.set(key, value)
      }
    }

    if (token) {
      params.set('personalize', 'true')
    }

    const query = params.toString()
    const headers: Record<string, string> = { Accept: 'application/json' }
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await fetch(`${API_URL}/projects${query ? `?${query}` : ''}`, {
      headers,
      next: token ? { revalidate: 0 } : { revalidate: 300, tags: ['projects'] },
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      return NextResponse.json(
        { status: 'error', message: body?.message ?? 'Failed to fetch projects', errors: body?.errors },
        { status: res.status },
      )
    }

    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch projects' },
      { status: 500 },
    )
  }
}
