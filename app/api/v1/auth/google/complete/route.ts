import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { setAuthCookies } from '@/lib/auth-cookies'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const res = await fetch(`${API_URL}/auth/google/complete`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

    const data = await res.json()
    const response = NextResponse.json(
      { user: data.user, message: data.message },
      { status: res.status },
    )

    if (res.ok && data.token && data.user?.role) {
      setAuthCookies(response, data.token, data.user.role)

      revalidatePath('/')
      revalidatePath('/projects')
      revalidatePath('/api/v1/projects')
      revalidateTag('projects')
    }

    return response
  } catch {
    return NextResponse.json({ message: 'Failed to complete Google signup' }, { status: 502 })
  }
}
