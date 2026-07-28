import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { setAuthCookies } from '@/lib/auth-cookies'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
    const body = await request.json()

    const res = await fetch(`${API_URL}/auth/verify-email-and-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const data = await res.json()

    if (!res.ok) {
        return NextResponse.json({ message: data.message }, { status: res.status })
    }

    const response = NextResponse.json({
        user: data.user,
        message: data.message,
    })
    setAuthCookies(response, data.token, data.user.role)
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/api/v1/projects')
    revalidatePath('/api/v1/projects/[slug]')
    revalidateTag('projects')
    return response
}
