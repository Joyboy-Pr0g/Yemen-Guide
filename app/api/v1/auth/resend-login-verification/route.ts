import { NextResponse, NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
    const body = await request.json()

    const res = await fetch(`${API_URL}/auth/resend-login-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    const data = await res.json()

    return NextResponse.json(data, { status: res.status })
}
