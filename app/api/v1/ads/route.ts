import { NextResponse, NextRequest } from 'next/server'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function GET(req: NextRequest) {
    try {
        const position = req.nextUrl.searchParams.get('position') || ''
        const query = position ? `?position=${position}` : ''
        const res = await fetch(`${API_URL}/ads${query}`, {
            headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error(`API Error: ${res.status}`)
        const data = await res.json()

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch ads',
        }, {
            status: 500
        })
    }
}