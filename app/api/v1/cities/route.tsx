import { NextResponse } from 'next/server'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
export async function GET() {
    try {
        const res = await fetch(`${API_URL}/cities`, {
            headers: { Accept: 'application/json', Method: 'GET' },
        })
        if (!res.ok) throw new Error(`API Error: ${res.status}`)
        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: 'Failed to fetch cities',
        }, {
            status: 500
        })
    }
}