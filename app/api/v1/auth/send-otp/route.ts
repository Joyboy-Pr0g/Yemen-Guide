import { NextResponse, NextRequest } from 'next/server'
import { getAuthToken, fetchBackend, parseJsonResponse } from '@/lib/api-proxy'

export async function POST(request: NextRequest) {
    const token = await getAuthToken(request)
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    try {
        const res = await fetchBackend('/auth/send-otp', token, { method: 'POST' })
        const data = await parseJsonResponse(res)
        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send OTP'
        return NextResponse.json({ message }, { status: 502 })
    }
}
