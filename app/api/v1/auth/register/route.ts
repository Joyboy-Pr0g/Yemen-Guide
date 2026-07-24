import { NextResponse, NextRequest } from 'next/server'
import { verifyTurnstileTokenDetailed, resolveTurnstileClientIp, turnstileFailureMessage } from '@/lib/turnstile'
import { setAuthCookies } from '@/lib/auth-cookies'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { turnstile_token, ...credentials } = body

    if (!turnstile_token || typeof turnstile_token !== 'string') {
        return NextResponse.json({ message: 'يرجى إكمال التحقق من الأمان.' }, { status: 400 })
    }

    try {
        const result = await verifyTurnstileTokenDetailed(
            turnstile_token,
            resolveTurnstileClientIp(
                request.headers.get('x-forwarded-for'),
                request.headers.get('x-real-ip'),
            ),
        )
        if (!result.success) {
            return NextResponse.json(
                { message: turnstileFailureMessage(result.errorCodes) },
                { status: 400 },
            )
        }
    } catch {
        return NextResponse.json({ message: 'خدمة التحقق غير متاحة حالياً.' }, { status: 503 })
    }

    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    })
    const data = await res.json()

    if (!res.ok) {
        return NextResponse.json({ message: data.message, errors: data.errors }, { status: res.status })
    }

    const response = NextResponse.json({
        user: data.user,
        message: data.message,
    })

    if (data.token && data.user?.role) {
        setAuthCookies(response, data.token, data.user.role)
    }

    return response
}
