import { NextResponse, NextRequest } from 'next/server'
import { fetchBackend, getAuthToken, parseJsonResponse } from '@/lib/api-proxy'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || '1'

        const token = await getAuthToken(request)
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
        }

        const res = await fetchBackend(
            `/admin/verifications?page=${page}`,
            token
        )
        const data = await parseJsonResponse(res)

        return NextResponse.json(data, { status: res.status })
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to fetch verifications'
        return NextResponse.json({ message }, { status: 502 })
    }
}