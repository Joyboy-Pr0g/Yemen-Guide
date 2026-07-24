import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { setAuthCookies } from '@/lib/auth-cookies'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.toString()
    const res = await fetch(`${API_URL}/auth/google/callback${query ? `?${query}` : ''}`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    })

    const data = await res.json()

    if (data?.needs_role) {
      return NextResponse.json(
        {
          needs_role: true,
          signup_token: data.signup_token,
          email: data.email,
          name: data.name,
          message: data.message,
        },
        { status: res.status },
      )
    }

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
    return NextResponse.json({ message: 'Failed to complete Google login' }, { status: 502 })
  }
}
