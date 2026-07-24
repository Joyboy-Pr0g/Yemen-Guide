import { NextResponse, NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const res = await fetch(`${API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(body),
        })
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send password reset'
        return NextResponse.json({ message }, { status: 502 })
    }
}
