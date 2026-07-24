import { NextResponse,NextRequest } from 'next/server'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function GET(req:NextRequest) {
    try {
        const query = req.nextUrl.searchParams.toString();
        const url = query ? `${API_URL}/cities/projects?${query}` : `${API_URL}/cities/projects`;
        const res = await fetch(url, {
            headers: { Accept: 'application/json', Method: 'GET' },
        })
        if (!res.ok) throw new Error(`API Error: ${res.status}`)
        const data = await res.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
        }, {
            status: 500
        })
    }
}